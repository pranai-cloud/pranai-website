'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

type Country = {
  flag: string;
  code: string;
  name: string;
  dial: string;
};

const COUNTRIES: Country[] = [
  { flag: '🇮🇳', code: 'IN', name: 'India', dial: '+91' },
  { flag: '🇺🇸', code: 'US', name: 'United States', dial: '+1' },
  { flag: '🇬🇧', code: 'GB', name: 'United Kingdom', dial: '+44' },
  { flag: '🇨🇦', code: 'CA', name: 'Canada', dial: '+1' },
  { flag: '🇦🇪', code: 'AE', name: 'UAE', dial: '+971' },
  { flag: '🇸🇬', code: 'SG', name: 'Singapore', dial: '+65' },
  { flag: '🇦🇺', code: 'AU', name: 'Australia', dial: '+61' },
  { flag: '🇩🇪', code: 'DE', name: 'Germany', dial: '+49' },
  { flag: '🇫🇷', code: 'FR', name: 'France', dial: '+33' },
  { flag: '🇯🇵', code: 'JP', name: 'Japan', dial: '+81' },
  { flag: '🇨🇳', code: 'CN', name: 'China', dial: '+86' },
  { flag: '🇰🇷', code: 'KR', name: 'South Korea', dial: '+82' },
  { flag: '🇧🇷', code: 'BR', name: 'Brazil', dial: '+55' },
  { flag: '🇲🇽', code: 'MX', name: 'Mexico', dial: '+52' },
  { flag: '🇿🇦', code: 'ZA', name: 'South Africa', dial: '+27' },
  { flag: '🇳🇬', code: 'NG', name: 'Nigeria', dial: '+234' },
  { flag: '🇰🇪', code: 'KE', name: 'Kenya', dial: '+254' },
  { flag: '🇪🇬', code: 'EG', name: 'Egypt', dial: '+20' },
  { flag: '🇸🇦', code: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { flag: '🇶🇦', code: 'QA', name: 'Qatar', dial: '+974' },
  { flag: '🇧🇭', code: 'BH', name: 'Bahrain', dial: '+973' },
  { flag: '🇰🇼', code: 'KW', name: 'Kuwait', dial: '+965' },
  { flag: '🇴🇲', code: 'OM', name: 'Oman', dial: '+968' },
  { flag: '🇵🇰', code: 'PK', name: 'Pakistan', dial: '+92' },
  { flag: '🇧🇩', code: 'BD', name: 'Bangladesh', dial: '+880' },
  { flag: '🇱🇰', code: 'LK', name: 'Sri Lanka', dial: '+94' },
  { flag: '🇳🇵', code: 'NP', name: 'Nepal', dial: '+977' },
  { flag: '🇲🇾', code: 'MY', name: 'Malaysia', dial: '+60' },
  { flag: '🇮🇩', code: 'ID', name: 'Indonesia', dial: '+62' },
  { flag: '🇹🇭', code: 'TH', name: 'Thailand', dial: '+66' },
  { flag: '🇻🇳', code: 'VN', name: 'Vietnam', dial: '+84' },
  { flag: '🇵🇭', code: 'PH', name: 'Philippines', dial: '+63' },
  { flag: '🇭🇰', code: 'HK', name: 'Hong Kong', dial: '+852' },
  { flag: '🇹🇼', code: 'TW', name: 'Taiwan', dial: '+886' },
  { flag: '🇳🇿', code: 'NZ', name: 'New Zealand', dial: '+64' },
  { flag: '🇮🇪', code: 'IE', name: 'Ireland', dial: '+353' },
  { flag: '🇳🇱', code: 'NL', name: 'Netherlands', dial: '+31' },
  { flag: '🇧🇪', code: 'BE', name: 'Belgium', dial: '+32' },
  { flag: '🇨🇭', code: 'CH', name: 'Switzerland', dial: '+41' },
  { flag: '🇦🇹', code: 'AT', name: 'Austria', dial: '+43' },
  { flag: '🇮🇹', code: 'IT', name: 'Italy', dial: '+39' },
  { flag: '🇪🇸', code: 'ES', name: 'Spain', dial: '+34' },
  { flag: '🇵🇹', code: 'PT', name: 'Portugal', dial: '+351' },
  { flag: '🇸🇪', code: 'SE', name: 'Sweden', dial: '+46' },
  { flag: '🇳🇴', code: 'NO', name: 'Norway', dial: '+47' },
  { flag: '🇩🇰', code: 'DK', name: 'Denmark', dial: '+45' },
  { flag: '🇫🇮', code: 'FI', name: 'Finland', dial: '+358' },
  { flag: '🇵🇱', code: 'PL', name: 'Poland', dial: '+48' },
  { flag: '🇨🇿', code: 'CZ', name: 'Czechia', dial: '+420' },
  { flag: '🇷🇴', code: 'RO', name: 'Romania', dial: '+40' },
  { flag: '🇺🇦', code: 'UA', name: 'Ukraine', dial: '+380' },
  { flag: '🇹🇷', code: 'TR', name: 'Turkey', dial: '+90' },
  { flag: '🇮🇱', code: 'IL', name: 'Israel', dial: '+972' },
  { flag: '🇷🇺', code: 'RU', name: 'Russia', dial: '+7' },
  { flag: '🇦🇷', code: 'AR', name: 'Argentina', dial: '+54' },
  { flag: '🇨🇱', code: 'CL', name: 'Chile', dial: '+56' },
  { flag: '🇨🇴', code: 'CO', name: 'Colombia', dial: '+57' },
  { flag: '🇵🇪', code: 'PE', name: 'Peru', dial: '+51' },
  { flag: '🇬🇭', code: 'GH', name: 'Ghana', dial: '+233' },
  { flag: '🇪🇹', code: 'ET', name: 'Ethiopia', dial: '+251' },
];

interface PhoneInputProps {
  id?: string;
  name?: string;
  required?: boolean;
  defaultCountry?: string;
  inputClassName?: string;
  errors?: string[];
}

export function PhoneInput({
  id = 'phone',
  name = 'phone',
  required = true,
  defaultCountry = '+91',
  inputClassName = '',
  errors,
}: PhoneInputProps) {
  const [selected, setSelected] = useState(
    () => COUNTRIES.find((c) => c.dial === defaultCountry) ?? COUNTRIES[0],
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      setSearch('');
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const filtered = search
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search),
      )
    : COUNTRIES;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-1.5 rounded-l-lg border border-r-0 border-black/[0.08] bg-neutral-50 px-3 py-3 text-sm transition hover:bg-neutral-100 shrink-0 ${inputClassName}`}
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="text-neutral-600 font-medium">{selected.code}</span>
          <ChevronDown className={`size-3.5 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        <input type="hidden" name="country_code" value={selected.dial} />
        <input
          id={id}
          name={name}
          type="tel"
          required={required}
          placeholder="98765 43210"
          className={`w-full rounded-r-lg border border-black/[0.08] bg-white px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#A3A3A3] outline-none transition-all focus:border-[#0D9488]/40 focus:ring-2 focus:ring-[#0D9488]/10 ${inputClassName}`}
        />
      </div>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-neutral-200 bg-white shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2.5">
            <Search className="size-3.5 text-neutral-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-400 outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto overscroll-contain py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-neutral-400">No countries found</p>
            ) : (
              filtered.map((country) => (
                <button
                  key={`${country.code}-${country.dial}`}
                  type="button"
                  onClick={() => {
                    setSelected(country);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition hover:bg-neutral-50 ${
                    selected.code === country.code && selected.dial === country.dial
                      ? 'bg-neutral-50 font-medium'
                      : ''
                  }`}
                >
                  <span className="text-base leading-none">{country.flag}</span>
                  <span className="text-neutral-800 flex-1">{country.name}</span>
                  <span className="text-xs text-neutral-400 font-mono">{country.code}</span>
                  <span className="text-xs text-neutral-500 font-mono w-12 text-right">{country.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {errors?.length ? <p className="mt-1.5 text-xs text-red-600">{errors[0]}</p> : null}
    </div>
  );
}
