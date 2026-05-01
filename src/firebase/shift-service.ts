import { getFirebaseAdmin } from '@/lib/firebase-admin';

export interface ShiftSlot {
  day: string;
  start: string;
  end: string;
  status: 'unavailable' | 'lesson';
}

export interface Participant {
  id?: string;
  name: string;
  slots: ShiftSlot[];
  updatedAt: string;
}

const COLLECTION_NAME = 'shifts';

export async function saveParticipantShift(name: string, slots: ShiftSlot[]) {
  const db = getFirebaseAdmin();
  if (!db) throw new Error('Firebase Admin not initialized');

  const participantData: Participant = {
    name,
    slots,
    updatedAt: new Date().toISOString(),
  };

  // We use name as a simple unique identifier or we can use auto-ID. 
  // Given the previous code used name to overwrite, let's stick to that for now but with a more robust query.
  const snapshot = await db.collection(COLLECTION_NAME).where('name', '==', name).get();
  
  if (!snapshot.empty) {
    const docId = snapshot.docs[0].id;
    await db.collection(COLLECTION_NAME).doc(docId).set(participantData, { merge: true });
    return docId;
  } else {
    const docRef = await db.collection(COLLECTION_NAME).add(participantData);
    return docRef.id;
  }
}

export async function getAllParticipants(): Promise<Participant[]> {
  const db = getFirebaseAdmin();
  if (!db) throw new Error('Firebase Admin not initialized');

  const snapshot = await db.collection(COLLECTION_NAME).orderBy('updatedAt', 'desc').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Participant));
}

export async function deleteParticipant(id: string) {
  const db = getFirebaseAdmin();
  if (!db) throw new Error('Firebase Admin not initialized');
  await db.collection(COLLECTION_NAME).doc(id).delete();
}
