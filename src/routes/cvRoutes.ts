import { Router } from 'express';
import { generateCV } from '../controllers/cvController';

const router = Router();

router.post('/generate-cv', generateCV);

export default router;