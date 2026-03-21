import { NextResponse } from 'next/server';

// GET - Get stats for countdowns
export async function GET() {
  // Mock countdowns for stats
  const countdowns = [
    { targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    { targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() },
    { targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    { targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
    { targetDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }, // Passed
  ];

  const now = new Date();
  const upcoming = countdowns.filter(c => new Date(c.targetDate) > now);
  const passed = countdowns.filter(c => new Date(c.targetDate) <= now);
  
  // Find nearest countdown
  let nearestDays: number | null = null;
  if (upcoming.length > 0) {
    const sorted = upcoming.sort((a, b) => 
      new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    );
    const diff = new Date(sorted[0].targetDate).getTime() - now.getTime();
    nearestDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return NextResponse.json({
    total: countdowns.length,
    upcoming: upcoming.length,
    passed: passed.length,
    nearestDays,
  });
}