'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { ContactModal, type ContactModalBranding } from '@/components/contact-modal';

interface ContactContextValue {
  openContact: () => void;
  closeContact: () => void;
  isOpen: boolean;
}

const ContactContext = createContext<ContactContextValue | null>(null);

export function useContactSafe(): ContactContextValue | null {
  return useContext(ContactContext);
}

export function ContactProvider({
  children,
  branding,
}: {
  children: ReactNode;
  branding?: ContactModalBranding;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContactContext.Provider
      value={{
        openContact: () => setIsOpen(true),
        closeContact: () => setIsOpen(false),
        isOpen,
      }}
    >
      {children}
      <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} branding={branding} />
    </ContactContext.Provider>
  );
}
