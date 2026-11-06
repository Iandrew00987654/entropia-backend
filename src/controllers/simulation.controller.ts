import { Request, Response } from 'express';
import { pool } from '../config/database';

export class SimulationController {
  // CREATE: Guardar una nueva simulación con todas sus entidades
  public static async create(req: Request, res: Response): Promise<void> {
    let conn;
    try {
      const { name, simulation_time, current_day, clock, is_night, entities } = req.body;
      conn = await pool.getConnection();
      await conn.beginTransaction();

      // 1. Insertar la simulación
      const simResult = await conn.query(
        `INSERT INTO simulations (name, simulation_time, current_day, clock, is_night, total_entities) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name || 'Simulación sin nombre', simulation_time, current_day, clock, is_night, entities?.length || 0]
      );
      const simulationId = Number(simResult.insertId);

      // 2. Insertar las entidades asociadas si existen
      if (Array.isArray(entities) && entities.length > 0) {
        for (const e of entities) {
          await conn.query(
            `INSERT INTO simulation_entities 
             (id, simulation_id, species_name, entity_type, is_alive, age, pos_x, pos_y, radius, 
              health, max_health, energy, max_energy, speed, state_name, growth, max_radius)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              e.id,
              simulationId,
              e.species_name,
              e.entity_type,
              e.is_alive ?? true,
              e.age ?? 0,
              e.pos_x,
              e.pos_y,
              e.radius,
              e.health ?? null,
              e.max_health ?? null,
              e.energy ?? null,
              e.max_energy ?? null,
              e.speed ?? null,
              e.state_name ?? null,
              e.growth ?? null,
              e.max_radius ?? null
            ]
          );
        }
      }

      await conn.commit();
      res.status(201).json({ message: 'Simulación guardada con éxito', simulationId });
    } catch (error) {
      if (conn) await conn.rollback();
      res.status(500).json({ error: 'Error al guardar la simulación', details: error });
    } finally {
      if (conn) conn.release();
    }
  }

  // READ ALL: Listar todas las simulaciones (para cargar partidas)
  public static async getAll(_req: Request, res: Response): Promise<void> {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM simulations ORDER BY created_at DESC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener simulaciones', details: error });
    } finally {
      if (conn) conn.release();
    }
  }

  // READ ONE: Obtener una simulación con todos sus organismos vivos
  public static async getById(req: Request, res: Response): Promise<void> {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();

      const sim = await conn.query('SELECT * FROM simulations WHERE id = ?', [id]);
      if (sim.length === 0) {
        res.status(404).json({ error: 'Simulación no encontrada' });
        return;
      }

      const entities = await conn.query('SELECT * FROM simulation_entities WHERE simulation_id = ?', [id]);
      res.json({ simulation: sim[0], entities });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener detalle de simulación', details: error });
    } finally {
      if (conn) conn.release();
    }
  }

  // UPDATE: Actualizar nombre o metadata de la simulación
  public static async update(req: Request, res: Response): Promise<void> {
    let conn;
    try {
      const { id } = req.params;
      const { name, current_day, clock, is_night } = req.body;
      conn = await pool.getConnection();

      const result = await conn.query(
        `UPDATE simulations 
         SET name = COALESCE(?, name), 
             current_day = COALESCE(?, current_day),
             clock = COALESCE(?, clock),
             is_night = COALESCE(?, is_night)
         WHERE id = ?`,
        [name, current_day, clock, is_night, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Simulación no encontrada' });
        return;
      }

      res.json({ message: 'Simulación actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar simulación', details: error });
    } finally {
      if (conn) conn.release();
    }
  }

  // DELETE: Eliminar simulación (y sus entidades por cascada)
  public static async delete(req: Request, res: Response): Promise<void> {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();

      const result = await conn.query('DELETE FROM simulations WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Simulación no encontrada' });
        return;
      }

      res.json({ message: 'Simulación eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar simulación', details: error });
    } finally {
      if (conn) conn.release();
    }
  }
}