import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { PranaiNurtureEmail } from '@/emails/PranaiNurtureEmail';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase admin environment variables');
  }
  return createClient(url, serviceKey);
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-webhook-secret');
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, email, company, ai_role } = body.record;

    if (!email) {
      return NextResponse.json({ error: 'No email in record' }, { status: 400 });
    }

    const companyName = company || 'your company';
    const roleLabels = (ai_role || '')
      .split(',')
      .map((r: string) =>
        r.trim()
          .replace(/-waitlist$/, '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (c: string) => c.toUpperCase()),
      )
      .filter(Boolean);
    const rolesDisplay = roleLabels.length > 0 ? roleLabels.join(', ') : 'AI agent';
    const firstName = (name || '').split(' ')[0] || 'there';

    const chat = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are a representative of the Pran.ai team (an AI digital workforce product by Fluxenta Technologies). Write exactly 2 short, highly professional and personalized paragraphs. Do not include a greeting (e.g. "Hi Name") and do not include a sign-off (e.g. "Best, Team") as the email template handles this. Reference the prospect\'s company name and the specific AI role(s) they selected. Be confident but not salesy. Just return the raw paragraph text.',
        },
        {
          role: 'user',
          content: `${firstName} from ${companyName} just requested a demo. They are interested in these AI role(s): ${rolesDisplay}. Write a personalized follow-up that: (1) thanks them by referencing their company ${companyName} and the specific role(s) they chose, (2) briefly explains how Pran.ai deploys native-speaking AI agents for those exact roles that handle calls and chats 24/7 with <500ms latency, and (3) invites them to book a 30-minute live demo where we'll configure a test agent tailored to ${companyName}.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 350,
    });

    const aiMessage = chat.choices[0]?.message?.content?.trim();
    if (!aiMessage) {
      throw new Error('Groq returned an empty response');
    }

    const subject = roleLabels.length > 1
      ? `Pran.ai — Your ${roleLabels.length} AI Agent Demo Request`
      : `Pran.ai — Your AI ${rolesDisplay} Demo Request`;

    await resend.emails.send({
      from: 'Pran.ai by Fluxenta <anurag@fluxenta.dev>',
      to: email,
      subject,
      react: PranaiNurtureEmail({
        prospectName: firstName,
        companyName,
        aiMessage,
        aiRoles: roleLabels,
      }),
    });

    const supabaseAdmin = getAdminSupabase();

    await Promise.all([
      supabaseAdmin
        .from('pranai_leads')
        .update({ status: 'emailed' })
        .eq('id', id),
      supabaseAdmin.from('interactions').insert({
        lead_id: id,
        type: 'email_sent',
        content: aiMessage,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[pranai-lead-nurture] Webhook error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
