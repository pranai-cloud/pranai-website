'use client';

import { useState, useEffect, useActionState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Headphones,
  Target,
  Phone,
  Wrench,
  Filter,
  Share2,
  Palette,
  UserSearch,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import {
  submitPranaiLead,
  type PranaiLeadFormState,
} from '@/actions/submit-pranai-lead';
import { PhoneInput } from '@/components/PhoneInput';

interface AIRole {
  value: string;
  label: string;
  icon: LucideIcon;
  waitlist?: boolean;
}

const AI_ROLES: AIRole[] = [
  { value: 'customer-support-representative', label: 'Customer Support Rep', icon: Headphones },
  { value: 'business-development-representative', label: 'Business Dev Rep', icon: Target },
  { value: 'front-desk-receptionist', label: 'Front Desk Receptionist', icon: Phone },
  { value: 'technical-support-engineer', label: 'Technical Support', icon: Wrench },
  { value: 'lead-qualifier', label: 'Lead Qualifier', icon: Filter },
  { value: 'social-media-manager-waitlist', label: 'Social Media Manager', icon: Share2, waitlist: true },
  { value: 'ui-ux-designer-waitlist', label: 'UI/UX Designer', icon: Palette, waitlist: true },
  { value: 'hr-recruiter-waitlist', label: 'HR Recruiter', icon: UserSearch, waitlist: true },
];

const initialState: PranaiLeadFormState = {
  success: false,
  message: '',
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1.5 text-xs text-red-600">{errors[0]}</p>;
}

const inputClasses =
  'w-full rounded-lg border border-black/[0.08] bg-white px-4 py-3 text-sm text-primary placeholder:text-stone-muted outline-none transition-all focus:border-pran-orange/40 focus:ring-2 focus:ring-pran-orange/10';

const labelClasses =
  'block text-xs font-medium uppercase tracking-[0.1em] text-secondary mb-2';

export function LeadCaptureForm() {
  const [formKey, setFormKey] = useState(0);

  return <FormInner key={formKey} onReset={() => setFormKey((k) => k + 1)} />;
}

function FormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction] = useActionState(submitPranaiLead, initialState);
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(true); // Form is now expanded by default
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [fields, setFields] = useState({ name: '', email: '', phone: '', company: '' });

  const isFormReady =
    fields.email.trim() !== '' &&
    (!isExpanded || (
      fields.name.trim() !== '' &&
      fields.phone.trim() !== '' &&
      fields.company.trim() !== '' &&
      selectedRoles.length > 0
    ));

  useEffect(() => {
    if (!state.success) return;
    const timer = setTimeout(onReset, 3000);
    return () => clearTimeout(timer);
  }, [state.success, onReset]);

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  if (state.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        className="relative overflow-hidden rounded-2xl border border-pran-orange/20 bg-gradient-to-br from-white to-pran-orange/[0.04] p-10 text-center shadow-lg shadow-pran-orange/5"
      >
        <div className="mx-auto mb-5 relative flex h-16 w-16 items-center justify-center">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-pran-orange/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-pran-orange"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-pran-orange"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.25 }}
          >
            <motion.svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              />
            </motion.svg>
          </motion.div>
        </div>

        <motion.h3
          className="text-xl font-bold text-primary mb-2 tracking-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          Thank You!
        </motion.h3>
        <motion.p
          className="text-sm text-secondary mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          We&apos;ll send you a product overview and next steps shortly.
        </motion.p>

        <motion.div className="h-1 w-full rounded-full bg-pran-orange/10 overflow-hidden">
          <motion.div
            className="h-full bg-pran-orange rounded-full origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="w-full mx-auto max-w-lg overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm"
    >
      <form
        action={handleSubmit}
        className="space-y-4"
        noValidate
      >
        <AnimatePresence>
          {state.message && !state.success && (
            <motion.div
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout>
          <label htmlFor="pranai-email" className={isExpanded ? labelClasses : 'sr-only'}>
            Work Email
          </label>
          <div className="relative">
            <input
              id="pranai-email"
              name="email"
              type="email"
              required
              placeholder={isExpanded ? "jane@company.com" : "Enter your work email..."}
              value={fields.email}
              onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
              onFocus={() => setIsExpanded(true)}
              className={inputClasses}
            />
            {!isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-pran-orange p-2 text-white shadow-sm hover:bg-pran-orange-light transition-colors"
                aria-label="Continue"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
          {isExpanded && <FieldError errors={state.errors?.email} />}
        </motion.div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <label htmlFor="pranai-name" className={labelClasses}>Full Name</label>
                <input
                  id="pranai-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={fields.name}
                  onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
                  className={inputClasses}
                />
                <FieldError errors={state.errors?.name} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pranai-phone" className={labelClasses}>Phone Number</label>
                  <PhoneInput
                    id="pranai-phone"
                    name="phone"
                    errors={state.errors?.phone}
                    onChange={(v) => setFields((f) => ({ ...f, phone: v }))}
                  />
                </div>
                <div>
                  <label htmlFor="pranai-company" className={labelClasses}>Company Name</label>
                  <input
                    id="pranai-company"
                    name="company"
                    type="text"
                    required
                    placeholder="Acme Inc."
                    value={fields.company}
                    onChange={(e) => setFields((f) => ({ ...f, company: e.target.value }))}
                    className={inputClasses}
                  />
                  <FieldError errors={state.errors?.company} />
                </div>
              </div>

              <div>
                <label className={labelClasses}>
                  Which AI Roles do you need?
                  <span className="ml-1.5 normal-case tracking-normal text-stone-400 font-normal">(select all that apply)</span>
                </label>
                <input type="hidden" name="ai_role" value={selectedRoles.join(', ')} />
                <div className="flex flex-wrap gap-2">
                  {AI_ROLES.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRoles.includes(role.value);
                    const toggle = () =>
                      setSelectedRoles((prev) =>
                        prev.includes(role.value)
                          ? prev.filter((v) => v !== role.value)
                          : [...prev, role.value],
                      );
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={toggle}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-all ${isSelected
                          ? 'border-pran-orange/40 bg-pran-orange/10 text-pran-orange ring-2 ring-pran-orange/10'
                          : 'border-black/[0.08] bg-white text-secondary hover:border-black/[0.14] hover:bg-stone-50'
                          }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {role.label}
                        {role.waitlist && (
                          <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-stone-400">Soon</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <FieldError errors={state.errors?.ai_role} />
              </div>

              <button
                type="submit"
                disabled={isPending || !isFormReady}
                className="mt-4 w-full rounded-lg bg-pran-orange px-6 py-3.5 text-sm font-bold text-white tracking-wide transition-all hover:bg-pran-orange-light disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Join Wishlist & Schedule Demo'
                )}
              </button>

              <p className="pt-2 text-center text-[10.5px] leading-relaxed text-stone-muted">
                By submitting, you agree to our{' '}
                <a href="/privacy-policy" className="text-secondary underline hover:text-primary">Privacy Policy</a>
                {' '}and{' '}
                <a href="/terms-of-service" className="text-secondary underline hover:text-primary">Terms of Service</a>.
                Your data is stored securely on our cloud infrastructure.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}
