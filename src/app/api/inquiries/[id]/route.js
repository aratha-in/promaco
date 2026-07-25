import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

// Helper to check authentication
function checkAuth(request) {
  return getSessionFromRequest(request);
}

// 1. PATCH - Update status and/or notes
export async function PATCH(request, { params }) {
  const session = checkAuth(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const { id } = params;

  try {
    const body = await request.json();
    const { status, notes, client_name, email, phone, project_type, budget, description } = body;

    // Build query dynamically based on passed parameters
    let fields = [];
    let values = [];

    if (status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }
    if (notes !== undefined) {
      fields.push('notes = ?');
      values.push(notes);
    }
    if (client_name !== undefined) {
      fields.push('client_name = ?');
      values.push(client_name);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      values.push(email);
    }
    if (phone !== undefined) {
      fields.push('phone = ?');
      values.push(phone);
    }
    if (project_type !== undefined) {
      fields.push('project_type = ?');
      values.push(project_type);
    }
    if (budget !== undefined) {
      fields.push('budget = ?');
      values.push(budget);
    }
    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields provided for update' }, { status: 400 });
    }

    values.push(id);
    const sql = `UPDATE inquiries SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, values);

    return NextResponse.json({ success: true, message: 'Inquiry updated successfully' });
  } catch (error) {
    console.error('Update inquiry error:', error);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}

// 2. DELETE - Remove an inquiry
export async function DELETE(request, { params }) {
  const session = checkAuth(request);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const { id } = params;

  try {
    await query('DELETE FROM inquiries WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
