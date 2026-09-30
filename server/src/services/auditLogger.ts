import { getDb } from './firebase.js';
import { AuditLogItem } from '../../../shared/types.js';

const localLogs: AuditLogItem[] = [
  {
    id: 'log-1',
    actorId: 'demo-admin',
    actorEmail: 'admin@demo.org',
    action: 'ROLE_ASSIGNMENT',
    entityType: 'user',
    entityId: 'user-402',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    metadata: { assignedRole: 'RESEARCHER' },
  },
  {
    id: 'log-2',
    actorId: 'demo-admin',
    actorEmail: 'admin@demo.org',
    action: 'PUBLICATION_APPROVED',
    entityType: 'publication',
    entityId: 'pub-ice',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

export async function logAuditEvent(
  actorId: string,
  actorEmail: string,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: Record<string, any>
): Promise<AuditLogItem> {
  const item: AuditLogItem = {
    id: `audit-${Date.now()}`,
    actorId,
    actorEmail,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    metadata,
  };

  const db = getDb();
  if (db) {
    try {
      await db.collection('auditLogs').doc(item.id).set(item);
    } catch (e) {
      console.warn('Firestore audit log set warning:', e);
    }
  }

  localLogs.unshift(item);
  return item;
}

export async function getAuditLogs(): Promise<AuditLogItem[]> {
  const db = getDb();
  if (db) {
    try {
      const snap = await db.collection('auditLogs').orderBy('timestamp', 'desc').limit(100).get();
      if (!snap.empty) {
        return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      }
    } catch (e) {
      console.warn('Firestore audit log query warning:', e);
    }
  }

  return localLogs;
}
