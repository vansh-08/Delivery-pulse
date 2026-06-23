import express from 'express';
import upload from '../middleware/upload.js';

import { uploadResources } from '../controllers/resourceController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadResources);

export default router;