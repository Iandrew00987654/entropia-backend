import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import simulationRoutes from './routes/simulation.routes';
import entityRoutes from './routes/entity.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares estándar
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Límite amplio para recibir listas de cientos de entidades

// Montaje de rutas API
app.use('/api/simulations', simulationRoutes);
app.use('/api/entities', entityRoutes);

// Endpoint de diagnóstico
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Servidor Entropía activo' });
});

// Inicio del servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor Entropía escuchando en http://localhost:${PORT}`);
  await testConnection();
});