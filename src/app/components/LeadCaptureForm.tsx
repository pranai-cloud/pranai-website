'use client';

import { useState, useEffect, useActionState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import {
  submitPranaiLead,
  type PranaiLeadFormState,
} from '@/actions/submit-pranai-lead';
import { PhoneInput } from '@/components/PhoneInput';

const AI_ROLES = [
  { value: '', label: 'Select the AI role you need' },
  { value: 'customer-support-representative', label: 'Customer Support Representative' },
  { value: 'business-development-representative', label: 'Business Development Representative' },
  { value: 'custom', label: 'Custom / Other' },
] as const;

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
  const [selectedRole, setSelectedRole] = useState('');

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <form
        action={handleSubmit}
        className="mx-auto max-w-lg space-y-4 rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm"
        noValidate
      >
        <AnimatePresence>
          {state.message && !state.success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.message}
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <label htmlFor="pranai-name" className={labelClasses}>Full Name</label>
          <input
            id="pranai-name"
            name="name"
            type="text"
            required
            placeholder="Jane Smith"
            className={inputClasses}
          />
          <FieldError errors={state.errors?.name} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pranai-email" className={labelClasses}>Work Email</label>
            <input
              id="pranai-email"
              name="email"
              type="email"
              required
              placeholder="jane@company.com"
              className={inputClasses}
            />
            <FieldError errors={state.errors?.email} />
          </div>
          <div>
            <label htmlFor="pranai-phone" className={labelClasses}>Phone Number</label>
            <PhoneInput id="pranai-phone" name="phone" errors={state.errors?.phone} />
          </div>
        </div>

        <div>
          <label htmlFor="pranai-company" className={labelClasses}>Company Name</label>
          <input
            id="pranai-company"
            name="company"
            type="text"
            required
            placeholder="Acme Inc."
            className={inputClasses}
          />
          <FieldError errors={state.errors?.company} />
        </div>

        <div>
          <label htmlFor="pranai-role" className={labelClasses}>Which AI Role do you need?</label>
          <select
            id="pranai-role"
            name={selectedRole === 'custom' ? '_ai_role_select' : 'ai_role'}
            required
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={`${inputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%23525252%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10`}
          >
            {AI_ROLES.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                {opt.label}
              </option>
            ))}
          </select>
          {selectedRole === 'custom' && (
            <input
              name="ai_role"
              type="text"
              required
              placeholder="e.g. Front Desk Receptionist"
              className={`${inputClasses} mt-2`}
            />
          )}
          <FieldError errors={state.errors?.ai_role} />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-pran-orange px-6 py-3.5 text-sm font-bold text-white tracking-wide transition-all hover:bg-pran-orange-light disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Get Started → Schedule a Demo'
          )}
        </button>

        <p className="text-center text-[10px] text-stone-muted tracking-wide">
          Your data is encrypted and never sold to third parties.
        </p>
      </form>
    </motion.div>
  );
}
