'use server';

import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';
import { Resend } from 'resend';
import { PranaiNurtureEmail } from '@/emails/PranaiNurtureEmail';

const pranaiLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+?[\d\s\-().]{7,20}$/,
      'Please enter a valid phone number',
    ),
  company: z.string().min(1, 'Company name is required').max(200),
  ai_role: z.string().min(1, 'Please select an AI role'),
});

export type PranaiLeadFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase admin environment variables');
  }
  return createClient(url, serviceKey);
}

async function sendNurtureEmail(lead: {
  id: string;
  name: string;
  email: string;
  company: string;
  ai_role: string;
}) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const resend = new Resend(process.env.RESEND_API_KEY);

    const companyName = lead.company || 'your company';
    const role = lead.ai_role || 'AI agent';

    const chat = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are a representative of the Pran.ai team (an AI digital workforce product by Fluxenta Technologies). Write exactly 2 short, highly professional paragraphs to a prospect who wants to deploy an AI agent. Do not include a greeting (e.g. "Hi Name") and do not include a sign-off (e.g. "Best, Team") as the email template handles this. Be confident but not salesy. Just return the raw paragraph text.',
        },
        {
          role: 'user',
          content: `The prospect from ${companyName} is interested in deploying a "${role}" AI agent. Thank them for their interest, briefly explain how Pran.ai can deploy a native-speaking AI ${role} that handles calls and chats 24/7, and invite them to book a 30-minute live demo where we'll configure a test agent tailored to their business.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiMessage = chat.choices[0]?.message?.content?.trim();
    if (!aiMessage) {
      throw new Error('Groq returned an empty response');
    }

    await resend.emails.send({
      from: 'Pran.ai by Fluxenta <anurag@fluxenta.dev>',
      to: lead.email,
      subject: `Pran.ai — Your AI ${role} Demo Request`,
      react: PranaiNurtureEmail({
        prospectName: lead.name || 'there',
        aiMessage,
        aiRole: role,
      }),
    });

    const supabaseAdmin = getAdminSupabase();
    await Promise.all([
      supabaseAdmin
        .from('pranai_leads')
        .update({ status: 'emailed' })
        .eq('id', lead.id),
      supabaseAdmin.from('interactions').insert({
        lead_id: lead.id,
        type: 'email_sent',
        content: aiMessage,
      }),
    ]);

    console.log(`[pranai] Nurture email sent to ${lead.email}`);
  } catch (err) {
    console.error('[pranai] Failed to send nurture email:', err);
  }
}

export async function submitPranaiLead(
  _prev: PranaiLeadFormState,
  formData: FormData,
): Promise<PranaiLeadFormState> {
  const countryCode = (formData.get('country_code') as string) || '+91';
  const rawPhone = (formData.get('phone') as string) || '';
  const fullPhone = rawPhone.startsWith('+') ? rawPhone : `${countryCode}${rawPhone.replace(/^0+/, '')}`;

  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: fullPhone,
    company: formData.get('company'),
    ai_role: formData.get('ai_role'),
  };

  const result = pranaiLeadSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { data: inserted, error } = await getAdminSupabase()
    .from('pranai_leads')
    .insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      company: result.data.company,
      ai_role: result.data.ai_role,
      utm_source: (formData.get('utm_source') as string) || null,
      utm_campaign: (formData.get('utm_campaign') as string) || null,
    })
    .select('id')
    .single();

  if (error || !inserted) {
    console.error('[submit-pranai-lead] Supabase insert error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again or email us directly.',
    };
  }

  const emailPayload = {
    id: inserted.id,
    name: result.data.name,
    email: result.data.email,
    company: result.data.company,
    ai_role: result.data.ai_role,
  };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
    || 'http://localhost:3000';

  fetch(`${baseUrl}/api/webhooks/pranai-lead-nurture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': process.env.WEBHOOK_SECRET || '',
    },
    body: JSON.stringify({ record: emailPayload }),
  }).catch((err) => console.error('[pranai] Background email trigger failed:', err));

  return {
    success: true,
    message: "You're all set! We'll send you a product overview shortly.",
  };
}
