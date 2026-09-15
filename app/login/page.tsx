'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Radio, KeyRound, Loader2, CheckCircle2, AlertCircle, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { UserRole } from '@/types';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const redirectByRole = (userRole: UserRole) => {
    if (userRole === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const fillDemoAccount = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg(null);
    setSuccessMsg(null);
    if (demoRole === 'admin') {
      setFullName('State Admin Officer');
    } else {
      setFullName('Field Operations Lead');
    }
  };

  const determineRoleFromEmail = (userEmail: string): UserRole => {
    const clean = userEmail.toLowerCase();
    if (clean.includes('admin')) return 'admin';
    if (clean.includes('operator') || clean.includes('sdrf') || clean.includes('sdma')) return 'field_operator';
    return 'citizen';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const supabase = createClient();
    const assignedRole = determineRoleFromEmail(email);

    try {
      if (mode === 'signup') {
        const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || (email.includes('admin') ? 'State Admin Officer' : email.split('@')[0]),
              role: assignedRole,
            },
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Auth Diagnostic SignUp Error]:', error.message);
          }
          if (error.message.includes('Invalid path') || error.message.includes('request URL')) {
            setErrorMsg(t('authFailed'));
          } else {
            setErrorMsg(error.message);
          }
        } else if (data.user) {
          // Attempt profile upsert safely
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: data.user.email,
              role: assignedRole,
              full_name: fullName || (email.includes('admin') ? 'State Admin Officer' : email.split('@')[0]),
              updated_at: new Date().toISOString(),
            });
          } catch {
            // Handled if profiles schema is not configured
          }

          if (data.session) {
            setSuccessMsg('Account created and signed in successfully!');
            redirectByRole(assignedRole);
          } else {
            setSuccessMsg('Account registered in Supabase! You can now sign in with your credentials.');
            setMode('signin');
          }
        }
      } else {
        // Attempt Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[Auth Diagnostic SignIn Error]:', error.message);
          }

          // If the demo or new user doesn't exist in Supabase Auth yet, auto-register them seamlessly
          if (error.message.includes('Invalid credentials') || error.message.includes('invalid_credentials')) {
            const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;
            const { data: autoSignUpData, error: autoSignUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName || (email.includes('admin') ? 'State Admin Officer' : email.split('@')[0]),
                  role: assignedRole,
                },
                emailRedirectTo: redirectUrl,
              },
            });

            if (!autoSignUpError && autoSignUpData?.user) {
              try {
                await supabase.from('profiles').upsert({
                  id: autoSignUpData.user.id,
                  email: autoSignUpData.user.email,
                  role: assignedRole,
                  full_name: fullName || (email.includes('admin') ? 'State Admin Officer' : email.split('@')[0]),
                  updated_at: new Date().toISOString(),
                });
              } catch {
                // Handled
              }

              if (autoSignUpData.session) {
                setSuccessMsg('Account created and signed in!');
                redirectByRole(assignedRole);
                return;
              } else {
                setSuccessMsg('Account registered in Supabase Auth! Please click Sign In once more.');
                return;
              }
            }
          }

          if (error.message.includes('Invalid path') || error.message.includes('request URL')) {
            setErrorMsg(t('authFailed'));
          } else {
            setErrorMsg(t('invalidCredentials'));
          }
        } else if (data.user) {
          setSuccessMsg('Signed in successfully! Verifying role permissions...');

          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

          const activeRole = (profile?.role as UserRole) || assignedRole;
          redirectByRole(activeRole);
        }
      }
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Auth Diagnostic Unexpected Error]:', err?.message);
      }
      setErrorMsg(t('authFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-sand-200 dark:bg-earth-800 rounded-2xl border border-sand-300 dark:border-earth-700 text-earth-700 dark:text-earth-300 mb-1">
            <Radio className="h-7 w-7 text-[#754A2B] dark:text-[#F59E0B]" />
          </div>
          <h1 className="text-2xl font-bold text-earth-900 dark:text-earth-100 tracking-tight">
            {t('welcomeBack')}
          </h1>
          <p className="text-xs text-earth-600 dark:text-earth-400">
            {t('loginSub')}
          </p>
        </div>

        {/* Demo Quick Fill Toolbar */}
        <div className="p-3.5 bg-sand-100 dark:bg-[#1B212B] border border-sand-300 dark:border-[#323C4B] rounded-2xl space-y-2 text-xs">
          <div className="font-bold text-earth-900 dark:text-earth-100 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#754A2B] dark:text-[#F59E0B]" />
            <span>Demo Quick-Fill Accounts:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@rahat.gov.in', 'admin')}
              className="px-3 py-1.5 rounded-lg bg-[#754A2B] hover:bg-[#5D3820] text-white text-xs font-semibold transition-colors shadow-xs"
            >
              Fill Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('operator@rahat.gov.in', 'field_operator')}
              className="px-3 py-1.5 rounded-lg bg-sand-200 dark:bg-earth-800 text-earth-900 dark:text-earth-100 border border-sand-300 dark:border-earth-700 text-xs font-semibold hover:bg-sand-300 transition-colors"
            >
              Fill Operator Demo
            </button>
          </div>
        </div>

        <Card variant="tactical">
          <CardHeader className="pb-3 border-b border-sand-300 dark:border-earth-800">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2 text-earth-900 dark:text-earth-100">
                <KeyRound className="h-4 w-4 text-earth-600 dark:text-earth-400" />
                {mode === 'signin' ? t('signIn') : t('createAccount')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs pt-4">
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-sand-300 dark:border-earth-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
                  mode === 'signin'
                    ? 'text-[#754A2B] dark:text-[#F59E0B] border-[#754A2B] dark:border-[#F59E0B] bg-sand-200/50 dark:bg-earth-800/50'
                    : 'text-earth-600 dark:text-earth-400 border-transparent hover:text-earth-900 dark:hover:text-white'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                {t('signIn')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-2.5 text-center font-semibold transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
                  mode === 'signup'
                    ? 'text-[#754A2B] dark:text-[#F59E0B] border-[#754A2B] dark:border-[#F59E0B] bg-sand-200/50 dark:bg-earth-800/50'
                    : 'text-earth-600 dark:text-earth-400 border-transparent hover:text-earth-900 dark:hover:text-white'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                {t('createAccount')}
              </button>
            </div>

            {/* Status Feedback Banners */}
            {errorMsg && (
              <div className="p-3 bg-[#A33D32]/15 border border-[#A33D32]/40 rounded-xl text-risk-severe text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-[#4F7A58]/15 border border-[#4F7A58]/40 rounded-xl text-risk-low text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-earth-800 dark:text-earth-200 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Officer Tashi Norbu"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl px-3.5 py-2.5 text-earth-900 dark:text-earth-100 focus:outline-none focus:ring-2 focus:ring-earth-500 font-medium"
                  />
                </div>
              )}

              <div>
                <label className="block text-earth-800 dark:text-earth-200 font-semibold mb-1">{t('emailAddress')}</label>
                <input
                  type="email"
                  required
                  placeholder="operator@rahat-ai.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl px-3.5 py-2.5 text-earth-900 dark:text-earth-100 focus:outline-none focus:ring-2 focus:ring-earth-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-earth-800 dark:text-earth-200 font-semibold mb-1">{t('password')}</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-sand-100 dark:bg-earth-800 border border-sand-300 dark:border-earth-700 rounded-xl px-3.5 py-2.5 text-earth-900 dark:text-earth-100 focus:outline-none focus:ring-2 focus:ring-earth-500 font-medium"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full py-3">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t('loading')}</span>
                  </>
                ) : (
                  <span>{mode === 'signin' ? t('signIn') : t('createAccount')}</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
