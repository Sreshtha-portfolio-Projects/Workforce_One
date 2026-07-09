import { Router } from 'express';
import { contactController } from '../controllers/contactController';

const router = Router();

router.post('/', contactController.sendMessage);

export default router;
