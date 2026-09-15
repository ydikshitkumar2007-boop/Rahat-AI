'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { createClient } from '@/lib/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
}

function resolveUserRole(email?: string | null, metadataRole?: string, profileRole?: string): UserRole {
  if (profileRole && (profileRole === 'admin' || profileRole === 'field_operator' || profileRole === 'citizen')) {
    return profileRole as UserRole;
  }
  if (metadataRole && (metadataRole === 'admin' || metadataRole === 'field_operator' || metadataRole === 'citizen')) {
    return metadataRole as UserRole;
  }
  const cleanEmail = (email || '').toLowerCase();
  if (cleanEmail.includes('admin')) {
    return 'admin';
  }
  if (cleanEmail.includes('operator') || cleanEmail.includes('sdrf') || cleanEmail.includes('sdma')) {
    return 'field_operator';
  }
  return 'citizen';
}

export function useAuth() {
  const [role, setRole] = useState<UserRole>('citizen');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setIsAuthenticated(true);
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', session.user.id)
            .maybeSingle();

          const activeRole = resolveUserRole(
            session.user.email,
            session.user.user_metadata?.role,
            profile?.role
          );

          setRole(activeRole);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email || 'Authenticated User',
          });
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setRole('citizen');
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
        setRole('citizen');
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', session.user.id)
          .maybeSingle();

        const activeRole = resolveUserRole(
          session.user.email,
          session.user.user_metadata?.role,
          profile?.role
        );

        setRole(activeRole);
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email || 'Authenticated User',
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setRole('citizen');
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser(null);
    setRole('citizen');
  };

  return {
    role,
    user,
    isLoading,
    isAuthenticated,
    signOut,
  };
}
