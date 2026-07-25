import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

// 1. GET - Admin Only - Retrieve all inquiries
export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const inquiries = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
  }
}

// 2. POST - Public - Submit new client inquiry / quote request
export async function POST(request) {
  try {
    const body = await request.json();
    const { client_name, email, phone, project_type, budget, description } = body;

    // Simple validation
    if (!client_name || !email || !phone || !project_type || !budget) {
      return NextResponse.json(
        { error: 'Required fields: Name, Email, Phone, Project Type, and Budget.' },
        { status: 400 }
      );
    }

    const result = await query(
      'INSERT INTO inquiries (client_name, email, phone, project_type, budget, description) VALUES (?, ?, ?, ?, ?, ?)',
      [client_name, email, phone, project_type, budget, description || '']
    );

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully!',
      insertId: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
