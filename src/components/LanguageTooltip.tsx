"use client";

import { ReactNode } from "react";

interface LanguageTooltipProps {
    children: ReactNode;
    title: string;
    languages: readonly string[] | string[];
}

export function LanguageTooltip({ children, title, languages }: LanguageTooltipProps) {
    return (
        <div className="group relative inline-block cursor-default">
            <span className="underline decoration-pran-orange/50 underline-offset-4 decoration-dashed font-medium text-pran-orange-light transition-colors hover:text-pran-orange">
                {children}
            </span>
            <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 w-max -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:-translate-y-1">
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-[0_8px_32px_rgba(249,115,22,0.15)] ring-1 ring-white/5">
                    <h4 className="mb-4 text-sm font-semibold tracking-wide text-white/90">
                        {title}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-2.5 text-sm text-white/60">
                        {languages.map((lang) => (
                            <span key={lang} className="text-left font-medium hover:text-white/90 transition-colors">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
                {/* Triangle arrow */}
                <div className="absolute left-1/2 top-[calc(100%-1px)] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-white/10 bg-zinc-950 ring-1 ring-transparent" />
            </div>
        </div>
    );
}
