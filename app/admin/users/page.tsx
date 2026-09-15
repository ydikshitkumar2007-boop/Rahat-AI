'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Users } from 'lucide-react';
import { useLanguage } from '@/lib/providers/LanguageProvider';

export default function AdminUsersPage() {
  const { t } = useLanguage();

  const demoUsers = [
    { id: 'usr-1', name: 'Dr. Anita Roy', email: 'a.roy@sdma.meghalaya.gov.in', role: 'admin', organization: 'Meghalaya SDMA', state: 'Meghalaya' },
    { id: 'usr-2', name: 'Tashi Namgyal', email: 'tashi.n@sdrf.sikkim.gov.in', role: 'field_operator', organization: 'Sikkim SDRF Team 4', state: 'Sikkim' },
    { id: 'usr-3', name: 'Lalthan Mawia', email: 'lalthan@aizawl.org', role: 'field_operator', organization: 'Mizoram Disaster Taskforce', state: 'Mizoram' },
    { id: 'usr-4', name: 'Prabin Das', email: 'prabin.das@gmail.com', role: 'citizen', organization: 'Community Observer', state: 'Assam' },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-sand-300 dark:border-earth-800 pb-4">
        <h1 className="text-xl font-bold text-earth-900 dark:text-earth-100 flex items-center gap-2">
          <Users className="h-5 w-5 text-earth-600 dark:text-earth-400" />
          {t('users')} & Access Control
        </h1>
        <p className="text-xs text-earth-600 dark:text-earth-400 mt-1">
          Manage system administrative permissions, field operator credentials, and citizen access levels.
        </p>
      </div>

      <Card variant="tactical">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sand-100 dark:bg-earth-800 text-earth-700 dark:text-earth-300 border-b border-sand-300 dark:border-earth-700 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">{t('emailAddress')}</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-300 dark:divide-earth-800 text-earth-800 dark:text-earth-200">
              {demoUsers.map((u) => (
                <tr key={u.id} className="hover:bg-sand-200/50 dark:hover:bg-earth-800/50">
                  <td className="px-4 py-3 font-bold text-earth-900 dark:text-earth-100">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-earth-700 dark:text-earth-300">{u.email}</td>
                  <td className="px-4 py-3 text-earth-600 dark:text-earth-400">{u.organization}</td>
                  <td className="px-4 py-3">{u.state}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      u.role === 'admin'
                        ? 'bg-[#4F7A58]/15 text-[#4F7A58] dark:text-[#4ADE80] border-[#4F7A58]/40'
                        : u.role === 'field_operator'
                        ? 'bg-[#B88422]/15 text-[#B88422] dark:text-[#FBBF24] border-[#B88422]/40'
                        : 'bg-sand-200 dark:bg-earth-800 text-earth-700 dark:text-earth-300 border-sand-300 dark:border-earth-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
