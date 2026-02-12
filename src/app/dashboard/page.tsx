import React from 'react';
import DashboardClient from './DashboardClient';
import { getLatestCommits } from '@/lib/github';

export const metadata = {
  title: 'Evolution Dashboard - Self-Evolving Website',
  description: 'Track the real-time evolution and AI agent status of the project.',
};

export default async function DashboardPage() {
  const commits = await getLatestCommits(5);

  return <DashboardClient commits={commits} />;
}
