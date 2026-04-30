import { NextResponse } from 'next/server';
import { getFirebaseAdmin } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, email, phone, department, university } = data;

    // 1. Temel validasyon
    if (!fullName || !email || !phone || !department || !university) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurmanız gerekmektedir.' },
        { status: 400 }
      );
    }

    // 2. Email format kontrolü (Basit güvenlik)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta adresi.' },
        { status: 400 }
      );
    }

    // 3. Firebase Admin'e bağlan
    const db = getFirebaseAdmin();

    if (!db) {
      console.error('Firebase DB connection failed - Check environment variables');
      // Geliştirme aşamasında kullanıcıyı uyarmak için
      return NextResponse.json(
        { error: 'Sunucu yapılandırması eksik (Firebase API Anahtarları).' },
        { status: 500 }
      );
    }

    // 4. Firestore'a kaydet
    const docRef = await db.collection('basvurular').add({
      fullName,
      email,
      phone,
      department,
      university,
      createdAt: new Date().toISOString(),
      status: 'new' // Başvurunun durumunu takip etmek için
    });

    console.log('Document written with ID: ', docRef.id);

    return NextResponse.json({ 
      message: 'Başvurunuz başarıyla alındı!',
      id: docRef.id 
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
