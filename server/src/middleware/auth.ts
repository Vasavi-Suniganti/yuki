import { Request, Response, NextFunction } from 'express';
import { getAuth, getDb } from '../services/firebase.js';
import { Role } from '../../../shared/types.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: Role;
    name?: string;
  };
}

export async function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  const authAdmin = getAuth();
  const dbAdmin = getDb();

  try {
    if (authAdmin) {
      const decoded = await authAdmin.verifyIdToken(token);
      let role: Role = 'PUBLIC_USER';
      let name = decoded.name || decoded.email?.split('@')[0] || 'User';

      if (dbAdmin) {
        const userDoc = await dbAdmin.collection('users').doc(decoded.uid).get();
        if (userDoc.exists) {
          const uData = userDoc.data();
          role = uData?.role || 'PUBLIC_USER';
          name = uData?.name || name;
        }
      }

      req.user = {
        uid: decoded.uid,
        email: decoded.email || '',
        role,
        name,
      };
    } else {
      // Demo mode token parsing for fallback development testing
      if (token.includes('demo-researcher')) req.user = { uid: 'demo-researcher', email: 'researcher@demo.org', role: 'researcher_scientist', name: 'Dr. Kavya Rao' };
      else if (token.includes('demo-reviewer')) req.user = { uid: 'demo-reviewer', email: 'reviewer@demo.org', role: 'researcher_scientist', name: 'Dr. Reviewer' };
      else if (token.includes('demo-media')) req.user = { uid: 'demo-media', email: 'media@demo.org', role: 'media_content', name: 'Media Manager' };
      else if (token.includes('demo-admin')) req.user = { uid: 'demo-admin', email: 'admin@demo.org', role: 'ncpor_admin', name: 'NCPOR Platform Admin' };
      else req.user = { uid: 'demo-user', email: 'user@demo.org', role: 'public_student', name: 'Public Student User' };
    }
  } catch (err) {
    console.warn('Token verification failed:', err);
  }

  next();
}

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const userNorm = req.user.role;
    const isAllowed = allowedRoles.some((r) => r === userNorm || (r === 'researcher_scientist' && (userNorm === 'RESEARCHER' || userNorm === 'SCIENTIFIC_REVIEWER')) || (r === 'media_content' && userNorm === 'MEDIA_MANAGER') || (r === 'ncpor_admin' && userNorm === 'PLATFORM_ADMIN') || (r === 'public_student' && userNorm === 'PUBLIC_USER'));
    if (!isAllowed) {
      return res.status(403).json({ message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}` });
    }
    next();
  };
}

// Simple in-memory rate limiter for backend API hardening
const rateMap = new Map<string, { count: number; resetAt: number }>();
export function rateLimiter(maxRequests = 100, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const record = rateMap.get(ip);

    if (!record || now > record.resetAt) {
      rateMap.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({ message: 'Too many requests. Please try again later.' });
    }

    record.count++;
    next();
  };
}
