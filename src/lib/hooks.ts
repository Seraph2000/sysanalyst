'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getPreferences } from '@/lib/preferences';

export function useAgentName(): string {
  const { user } = useAuth();
  const [agentName, setAgentName] = useState('Seraphina');

  useEffect(() => {
    if (!user) return;
    getPreferences(user.id).then((prefs) => {
      setAgentName(prefs.agent_name);
    });
  }, [user]);

  return agentName;
}
