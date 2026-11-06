import { Router } from 'express';
import { SimulationController } from '../controllers/simulation.controller';

const router = Router();

router.post('/', SimulationController.create);
router.get('/', SimulationController.getAll);
router.get('/:id', SimulationController.getById);
router.put('/:id', SimulationController.update);
router.delete('/:id', SimulationController.delete);

export default router;