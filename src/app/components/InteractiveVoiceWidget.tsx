"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { PhoneCall, Sparkles, Headset, Target, Calendar, ShoppingCart } from "lucide-react";

type CallState = "idle" | "connecting" | "active";

const SCENARIOS = [
    { label: "Customer Support", icon: Headset },
    { label: "Lead Qualification", icon: Target },
    { label: "Receptionist", icon: Calendar },
    { label: "Cart Recovery", icon: ShoppingCart }
];

export function InteractiveVoiceWidget() {
    const [selectedScenario, setSelectedScenario] = useState(SCENARIOS[0]);
    const [callState, setCallState] = useState<CallState>("idle");
    const [isMobile, setIsMobile] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const lowPerfMode = isMobile || prefersReducedMotion;

    useEffect(() => {
        const media = window.matchMedia("(max-width: 768px)");
        const onChange = () => setIsMobile(media.matches);
        onChange();
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const toggleCall = () => {
        if (callState === "idle") {
            setCallState("connecting");
            setTimeout(() => setCallState("active"), 1200);
        } else {
            setCallState("idle");
        }
    };

    return (
        <motion.div
            layout={!lowPerfMode}
            initial={lowPerfMode ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={lowPerfMode ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
            className="relative w-full mx-auto max-w-lg overflow-hidden rounded-3xl border border-black/[0.06] bg-white p-6 sm:p-8 shadow-sm"
        >
            {/* Background blurred mesh */}
            {!lowPerfMode && (
                <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-3xl">
                    <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pran-orange/5 blur-3xl mix-blend-multiply" />
                    <div className="absolute inset-0 backdrop-blur-3xl bg-white/40" />
                </div>
            )}

            <div className="relative z-10">
                <motion.div layout={!lowPerfMode ? "position" : false} className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-primary tracking-tight mb-2">
                        Start talking to our AI Voice Agent
                    </h3>

                    <AnimatePresence mode="wait">
                        {callState === "active" ? (
                            <motion.div
                                key="active-waveform"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="flex h-6 w-full items-center justify-center gap-1.5 opacity-80"
                            >
                                {Array.from({ length: lowPerfMode ? 4 : 7 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 rounded-full bg-pran-orange"
                                        initial={{ height: "20%" }}
                                        animate={lowPerfMode ? { height: ["20%", "60%", "20%"] } : { height: ["20%", `${Math.random() * 80 + 20}%`, "20%"] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: lowPerfMode ? 1 : 0.4 + Math.random() * 0.4,
                                            ease: "easeInOut",
                                        }}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.p
                                key="idle-text"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm text-secondary px-4"
                            >
                                Allow mic access and start chatting with our voice agent in real time.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                <motion.div layout={!lowPerfMode ? "position" : false} className="flex flex-wrap justify-center gap-2 mb-8">
                    {SCENARIOS.map((scenario) => {
                        const isSelected = selectedScenario.label === scenario.label;
                        return (
                            <button
                                key={scenario.label}
                                onClick={() => {
                                    if (callState !== "active") setSelectedScenario(scenario);
                                }}
                                disabled={callState === "active"}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${isSelected
                                    ? "border border-pran-orange/30 bg-pran-orange/5 text-pran-orange shadow-sm"
                                    : "border border-black/[0.08] bg-white text-secondary hover:bg-stone-50 hover:text-primary"
                                    } ${callState === "active" ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <scenario.icon className={`h-3.5 w-3.5 ${isSelected ? 'text-pran-orange' : 'text-secondary/70 group-hover:text-primary/70'}`} />
                                {scenario.label}
                            </button>
                        );
                    })}
                </motion.div>

                <motion.div layout={!lowPerfMode ? "position" : false} className="flex justify-center">
                    <button
                        onClick={toggleCall}
                        className={`group relative flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold tracking-wide text-white transition-all shadow-md overflow-hidden ${callState === "active"
                            ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                            : "bg-pran-orange hover:bg-pran-orange-light shadow-pran-orange/20"
                            }`}
                    >
                        {callState === "active" ? (
                            <>
                                <PhoneCall className="h-5 w-5 fill-current" />
                                End Call
                            </>
                        ) : callState === "connecting" ? (
                            <>
                                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4" />
                                Start Call
                            </>
                        )}

                        {/* Shimmer effect for Start Call */}
                        {callState === "idle" && !lowPerfMode && (
                            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        )}
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
}
