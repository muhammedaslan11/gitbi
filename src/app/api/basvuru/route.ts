import { NextResponse } from 'next/server';
import { pb } from '@/lib/pocketbase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { fullName, email, phone, department, university, description } = data;

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

    // 3. PocketBase'e kaydet
    const record = await pb.collection('gitbiforms').create({
      name: fullName,
      phone,
      email,
      organisation: university,
      department,
      description: description || '',
    });

    return NextResponse.json({
      message: 'Başvurunuz başarıyla alındı!',
      id: record.id,
    });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
