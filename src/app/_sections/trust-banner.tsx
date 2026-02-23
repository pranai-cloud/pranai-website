const LOGOS = [
    {
        name: "Microsoft Azure",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
                <path d="M5.483 21.3H24L14.025 4.013l-3.3 5.715c-.131.229-.089.52.1.705l6.565 6.611c.214.215.061.583-.243.583H8.384L5.483 21.3zM13.431 2.984l-2.074-3.56C11.168-.89 10.749-.89 10.56.685L.004 21.3h5.483L13.431 2.984z" />
            </svg>
        ),
    },
    {
        name: "Cloudflare",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
                <path d="M16.963 8.163c-.114-1.353-.668-2.613-1.611-3.666-1.558-1.722-4.04-2.525-6.526-2.126-2.002.321-3.791 1.584-4.809 3.394C1.516 6.345 0 8.599 0 11.085v.004c0 3.033 2.122 5.58 5.097 6.138.309.058.623.091.942.102h12.553c2.988 0 5.408-2.43 5.408-5.429 0-2.887-2.274-5.26-5.132-5.419a4.802 4.802 0 00-1.905-1.682z" />
            </svg>
        ),
    },
    {
        name: "Deepgram",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-auto">
                <path d="M11.96 0C5.355 0 0 5.355 0 11.96s5.355 11.96 11.96 11.96 11.96-5.355 11.96-11.96S18.565 0 11.96 0zm-2.89 15.353V8.567h4.032c2.091 0 3.633 1.144 3.633 3.393 0 2.249-1.542 3.393-3.633 3.393H9.07zm1.688-1.4h2.217c1.171 0 1.95-.572 1.95-1.993 0-1.421-.779-1.993-1.95-1.993h-2.217v3.986z" />
            </svg>
        ),
    },
    {
        name: "Groq",
        svg: (
            <span className="text-2xl font-black tracking-tighter">Groq</span>
        ),
    },
    {
        name: "Telnyx",
        svg: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1.125rem] w-auto">
                <path d="M19.16 2.3A1.4 1.4 0 0 0 17.65 1h-5.23L4 12V2.4A1.4 1.4 0 0 0 2.6 1H0v20.6A2.4 2.4 0 0 0 2.4 24h5.21l8.47-11.08v9.52A1.56 1.56 0 0 0 17.65 24h6.35V2.4a1.4 1.4 0 0 0-1.4-1.4h-3.44zm-14 20h-3.6V2.6h2.2A1.4 1.4 0 0 1 5.16 4v18.3zM22.4 22.4h-3.34a1.4 1.4 0 0 1-1.4-1.4V4.18l-9 11.75H4L14.07 1.5h2.17a1.4 1.4 0 0 1 1.41 1.4z" />
            </svg>
        ),
    }
];

export function TrustBanner() {
    return (
        <div className="border-t border-black/[0.06] bg-stone-50/50 py-8">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-12 lg:px-20 text-center">
                <p className="mb-8 text-xs font-medium uppercase tracking-[0.15em] text-secondary">
                    Enterprise-grade infrastructure powered by:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-50 grayscale transition-all hover:grayscale-0">
                    {LOGOS.map((logo) => (
                        <div key={logo.name} className="flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors" title={logo.name}>
                            {logo.svg}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
