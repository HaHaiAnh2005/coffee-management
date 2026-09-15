import { axiosClient } from '../config/axios';
import type { AuditLog } from '../store/audit.store';

export const auditApi = {
  getLogs: async (): Promise<AuditLog[]> => {
    try {
      const res: any = await axiosClient.get('/audit-logs');
      return res?.data || [];
    } catch {
      return [];
    }
  },

  createLog: async (log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog | null> => {
    try {
      const res: any = await axiosClient.post('/audit-logs', log);
      return res?.data || null;
    } catch {
      return null;
    }
  },

  clearLogs: async (): Promise<boolean> => {
    try {
      await axiosClient.delete('/audit-logs');
      return true;
    } catch {
      return false;
    }
  },
};
