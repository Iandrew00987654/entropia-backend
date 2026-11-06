import { Request, Response } from 'express';
import { pool } from '../config/database';

export class EntityController {
  // CREATE: Registrar un animal o planta nuevo en una simulación existente
  public static async create(req: Request, res: Response): Promise<void> {
    let conn;
    try {
      const { simulation_id, id, species_name, entity_type, pos_x, pos_y, radius, health, energy, speed, state_name, growth, max_radius } = req.body;
      conn = await pool.getConnection();

      await conn.query(
        `INSERT INTO simulation_entities 
         (id, simulation_id, species_name, entity_type, pos_x, pos_y, radius, health, energy, speed, state_name, growth, max_radius)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, simulation_id, species_name, entity_type, pos_x, pos_y, radius, health ?? null, energy ?? null, speed ?? null, state_name ?? null, growth ?? null, max_radius ?? null]
      );

      res.status(201).json({ message: 'Entidad creada con éxito', entityId: id });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar entidad', details: error });
    } finally {
      if (conn) conn.release();
    }
  }

  // UPDATE: Actualizar el estado de un animal (ej. recibió daño o gastó energía)
  public static async update(req: Request, res: Response): Promise<void> {
    let conn;
    try {
      const { id } = req.params;
      const { health, energy, pos_x, pos_y, state_name, is_alive } = req.body;
      conn = await pool.getConnection();

      const result = await conn.query(
        `UPDATE simulation_entities 
         SET health = COALESCE(?, health),
             energy = COALESCE(?, energy),
             pos_x = COALESCE(?, pos_x),
             pos_y = COALESCE(?, pos_y),
             state_name = COALESCE(?, state_name),
             is_alive = COALESCE(?, is_alive)
         WHERE id = ?`,
        [health, energy, pos_x, pos_y, state_name, is_alive, id]
      );

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Entidad no encontrada' });
        return;
      }

      res.json({ message: 'Entidad actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar entidad', details: error });
    } finally {
      if (conn) conn.release();
    }
  }

  // DELETE: Eliminar una entidad específica
  public static async delete(req: Request, res: Response): Promise<void> {
    let conn;
    try {
      const { id } = req.params;
      conn = await pool.getConnection();

      const result = await conn.query('DELETE FROM simulation_entities WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Entidad no encontrada' });
        return;
      }

      res.json({ message: 'Entidad eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar entidad', details: error });
    } finally {
      if (conn) conn.release();
    }
  }
}