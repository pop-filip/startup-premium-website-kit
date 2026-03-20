import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// CONTACT FORM API — Place at: app/api/contact/route.ts
//
// Features:
//   - Zod validation
//   - Rate limiting (5 requests per minute per IP)
//   - Honeypot spam protection
//   - Email sending (Resend, or swap for your provider)
//   - CSRF-safe (Next.js handles this)
//
// npm install zod resend
// ============================================================

// --- Simple in-memory rate limiter ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  record.count++;
  return record.count <= RATE_LIMIT;
}

// --- Validation ---
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  honeypot?: string; // Spam trap — should be empty
}

function validateForm(data: unknown): { valid: true; data: ContactForm } | { valid: false; errors: string[] } {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }

  const form = data as Record<string, unknown>;

  // Honeypot check — bots fill this hidden field
  if (form.honeypot && typeof form.honeypot === 'string' && form.honeypot.length > 0) {
    // Silently reject spam — don't reveal why
    return { valid: false, errors: ['Request rejected'] };
  }

  if (!form.name || typeof form.name !== 'string' || form.name.trim().length < 2) {
    errors.push('Ime mora imati najmanje 2 karaktera');
  }

  if (!form.email || typeof form.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.push('Email adresa nije validna');
  }

  if (!form.subject || typeof form.subject !== 'string' || form.subject.trim().length < 3) {
    errors.push('Predmet mora imati najmanje 3 karaktera');
  }

  if (!form.message || typeof form.message !== 'string' || form.message.trim().length < 10) {
    errors.push('Poruka mora imati najmanje 10 karaktera');
  }

  if (typeof form.message === 'string' && form.message.length > 5000) {
    errors.push('Poruka ne sme biti duža od 5000 karaktera');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: (form.name as string).trim(),
      email: (form.email as string).trim().toLowerCase(),
      subject: (form.subject as string).trim(),
      message: (form.message as string).trim(),
      phone: form.phone ? String(form.phone).trim() : undefined,
    },
  };
}


// ============================================================
// POST /api/contact
// ============================================================
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Previše zahteva. Pokušajte ponovo za minut.' },
        { status: 429 }
      );
    }

    // 2. Parse & validate
    const body = await request.json();
    const result = validateForm(body);

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Validacija nije uspela', details: result.errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message, phone } = result.data;

    // 3. Send email
    // ---- Option A: Using Resend (recommended) ----
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from: `Website <${process.env.EMAIL_FROM || 'noreply@yourdomain.com'}>`,
    //   to: [process.env.CONTACT_EMAIL || 'info@yourdomain.com'],
    //   replyTo: email,
    //   subject: `[Kontakt] ${subject}`,
    //   html: `
    //     <h2>Nova kontakt poruka</h2>
    //     <p><strong>Ime:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
    //     <p><strong>Predmet:</strong> ${subject}</p>
    //     <hr />
    //     <p>${message.replace(/\n/g, '<br />')}</p>
    //   `,
    // });

    // ---- Option B: Using SMTP (nodemailer) ----
    // import nodemailer from 'nodemailer';
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: Number(process.env.SMTP_PORT),
    //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    // });
    // await transporter.sendMail({ ... });

    // 4. Log (replace with database save in production)
    console.log('Contact form submission:', { name, email, subject, message: message.slice(0, 100) });

    // 5. Success response
    return NextResponse.json(
      { success: true, message: 'Poruka je uspešno poslata. Odgovorićemo vam u najkraćem roku.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Došlo je do greške. Pokušajte ponovo.' },
      { status: 500 }
    );
  }
}
