import { Router } from 'express';
import {
    getApplications,
    getApplicationById,
    createApplication,
    updateApplication,
    deleteApplication,
    getStats
} from '../controllers/applications';

const router = Router();

router.get('/applications', getApplications);
router.get('/applications/:id', getApplicationById);
router.post('/applications', createApplication);
router.put('/applications/:id', updateApplication);
router.delete('/applications/:id', deleteApplication);

router.get('/stats', getStats);

export default router;
