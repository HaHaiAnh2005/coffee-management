import { Router } from 'express';
import { getAuditLogs, createAuditLog, clearAuditLogs } from '../controllers/audit.controller';

const router = Router();

router.get('/', getAuditLogs);
router.post('/', createAuditLog);
router.delete('/', clearAuditLogs);

export default router;
