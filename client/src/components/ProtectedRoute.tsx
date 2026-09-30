import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Role, normalizeRole } from '../../../shared/types';
import { Snowflake } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#dce9ed] text-[#183647]">
        <Snowflake className="h-10 w-10 animate-spin text-[#487b91]" />
        <span className="mt-4 text-xs font-bold tracking-[0.2em]">VERIFYING YUKI SECURITY CREDENTIALS...</span>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userNorm = normalizeRole(profile.role);
    const allowedNorm = allowedRoles.map((r) => normalizeRole(r));
    if (!allowedNorm.includes(userNorm)) {
      // Auto-redirect to home route for the user's role if unauthorized
      return <Navigate to={getRoleHomeRoute(profile.role)} replace />;
    }
  }

  return <>{children}</>;
}

export function getRoleHomeRoute(role?: Role | string): string {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'researcher_scientist':
      return '/researcher';
    case 'media_content':
      return '/media-manager';
    case 'ncpor_admin':
      return '/admin';
    case 'public_student':
    default:
      return '/dashboard';
  }
}
