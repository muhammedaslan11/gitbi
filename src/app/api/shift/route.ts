import { NextResponse } from 'next/server';
import { getAllParticipants, saveParticipantShift, deleteParticipant } from '@/firebase/shift-service';

export async function GET() {
  try {
    const participants = await getAllParticipants();
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, slots } = await request.json();
    if (!name || !slots) {
      return NextResponse.json({ error: 'Name and slots are required' }, { status: 400 });
    }
    const id = await saveParticipantShift(name, slots);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error saving shift:', error);
    return NextResponse.json({ error: 'Failed to save shift' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    await deleteParticipant(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json({ error: 'Failed to delete shift' }, { status: 500 });
  }
}
