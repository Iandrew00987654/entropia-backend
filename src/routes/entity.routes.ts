import { Router } from 'express';
import { EntityController } from '../controllers/entity.controller';

const router = Router();

router.post('/', EntityController.create);
router.put('/:id', EntityController.update);
router.delete('/:id', EntityController.delete);

export default router;