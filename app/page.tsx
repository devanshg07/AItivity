'use client';

import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <Dashboard />
    </>
  );
}
