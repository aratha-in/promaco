import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const faqs = await query('SELECT * FROM faqs ORDER BY id ASC');
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Fetch faqs error:', error);
    return NextResponse.json({ error: 'Failed to fetch faqs' }, { status: 500 });
  }
}
