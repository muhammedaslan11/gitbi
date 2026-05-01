import { NextResponse } from "next/server";

// In-memory store for rate limiting. 
// Note: This resets on server restart, but is effective against rapid bot attacks.
const attempts = new Map<string, { count: number, lockUntil: number }>();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    
    const userAttempt = attempts.get(ip) || { count: 0, lockUntil: 0 };

    // Check if currently locked
    if (userAttempt.lockUntil > now) {
      const remainingMin = Math.ceil((userAttempt.lockUntil - now) / 60000);
      return NextResponse.json({ 
        success: false, 
        message: `Çok fazla hatalı deneme! Güvenlik nedeniyle ${remainingMin} dakika engellendiniz.` 
      }, { status: 429 });
    }

    const { password } = await request.json();
    const correctPassword = process.env.SHIFT_PASSWORD;

    if (password === correctPassword) {
      // Success: Reset attempts
      attempts.delete(ip);
      return NextResponse.json({ success: true });
    } else {
      userAttempt.count += 1;
      let message = "Hatalı Şifre";
      
      if (userAttempt.count >= 5) {
        userAttempt.lockUntil = now + 15 * 60 * 1000; // 15 min lockout
        userAttempt.count = 0;
        message = "5 kez hatalı giriş yaptınız. 15 dakika boyunca engellendiniz.";
      } else {
        message = `Hatalı şifre. ${5 - userAttempt.count} hakkınız kaldı.`;
      }
      
      attempts.set(ip, userAttempt);
      return NextResponse.json({ success: false, message }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Sunucu hatası" }, { status: 500 });
  }
}
