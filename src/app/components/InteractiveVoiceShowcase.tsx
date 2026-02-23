"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, PhoneCall } from "lucide-react";

const SCENARIOS = ["Real Estate", "Clinic", "Support"];

export function InteractiveVoiceShowcase() {
    const [activeScenario, setActiveScenario] = useState(SCENARIOS[0]);
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
            className="relative w-full mx-auto max-w-lg overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm"
        >
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                <span className="rounded-full border border-pran-orange/20 bg-white px-3 py-1 text-xs font-semibold text-pran-orange shadow-sm">
                    Coming Soon
                </span>
            </div>
            <motion.div layout="position" className="flex items-center gap-3 mb-6">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-pran-orange/10 text-pran-orange">
                    <PhoneCall className="w-5 h-5" />
                    {isPlaying && (
                        <motion.div
                            layoutId="ringing"
                            className="absolute inset-0 rounded-full border-2 border-pran-orange/30"
                            animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        />
                    )}
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-primary">
                        listen to pran.ai
                    </h3>
                    <p className="text-xs text-secondary">Active Call Interface</p>
                </div>
            </motion.div>

            <motion.div layout="position" className="flex flex-wrap gap-2 mb-6">
                {SCENARIOS.map((s) => (
                    <button
                        key={s}
                        onClick={() => {
                            setActiveScenario(s);
                            setIsPlaying(false);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeScenario === s
                            ? "bg-pran-orange text-white"
                            : "bg-stone-50 text-secondary border border-black/[0.08] hover:bg-stone-100"
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </motion.div>

            <motion.div layout="position" className="flex items-center gap-4 rounded-xl bg-stone-50 p-4 border border-black/[0.04]">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pran-orange text-white shadow-md transition-colors hover:bg-pran-orange-light shadow-pran-orange/20"
                >
                    {isPlaying ? (
                        <Pause className="h-4 w-4 fill-current" />
                    ) : (
                        <Play className="h-4 w-4 fill-current ml-0.5" />
                    )}
                </button>

                <div className="flex h-8 w-full flex-1 items-center justify-around overflow-hidden px-2 opacity-80">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-1 rounded-full bg-pran-orange"
                            initial={{ height: "20%" }}
                            animate={{
                                height: isPlaying
                                    ? ["20%", `${Math.random() * 60 + 40}%`, "20%"]
                                    : "20%",
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: isPlaying ? 0.4 + Math.random() * 0.4 : 0,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>
                <div className="text-xs font-medium text-secondary min-w-[32px] text-right">
                    {isPlaying ? "Live" : "0:00"}
                </div>
            </motion.div>
        </motion.div>
    );
}
