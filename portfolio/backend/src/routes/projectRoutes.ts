import { Router } from 'express';
import { projectController } from '../controllers/projectController';

const router = Router();

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);

export default router;
