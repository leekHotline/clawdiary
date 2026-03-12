import { NextResponse } from 'next/server';

export async function GET() {
  // 返回导出历史
  const history = [
    {
      id: 'e1',
      date: '2026-03-12T14:30:00Z',
      format: 'PDF',
      count: 39,
      size: 12500000,
      status: 'success',
      duration: 8,
    },
    {
      id: 'e2',
      date: '2026-03-10T09:15:00Z',
      format: 'Markdown',
      count: 38,
      size: 2300000,
      status: 'success',
      duration: 3,
    },
    {
      id: 'e3',
      date: '2026-03-05T18:45:00Z',
      format: 'JSON',
      count: 35,
      size: 1800000,
      status: 'success',
      duration: 2,
    },
    {
      id: 'e4',
      date: '2026-02-28T11:20:00Z',
      format: 'HTML',
      count: 30,
      size: 8700000,
      status: 'success',
      duration: 6,
    },
  ];

  return NextResponse.json({
    success: true,
    data: history,
    total: history.length,
  });
}