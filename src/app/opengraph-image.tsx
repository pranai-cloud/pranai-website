import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Pran.ai – AI-Powered Digital Workforce That Speaks Any Language";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#FAFAF8",
                    fontFamily: "system-ui, sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-180px",
                        right: "-120px",
                        width: "650px",
                        height: "650px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 65%)",
                        display: "flex",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-220px",
                        left: "-140px",
                        width: "750px",
                        height: "750px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(251, 146, 60, 0.07) 0%, transparent 65%)",
                        display: "flex",
                    }}
                />

                <div style={{ position: "absolute", top: "72px", left: "100px", width: "8px", height: "8px", borderRadius: "50%", background: "#f97316", opacity: 0.45, display: "flex" }} />
                <div style={{ position: "absolute", bottom: "100px", right: "140px", width: "6px", height: "6px", borderRadius: "50%", background: "#fb923c", opacity: 0.3, display: "flex" }} />
                <div style={{ position: "absolute", top: "200px", right: "90px", width: "4px", height: "4px", borderRadius: "50%", background: "#f97316", opacity: 0.2, display: "flex" }} />
                <div style={{ position: "absolute", bottom: "180px", left: "130px", width: "5px", height: "5px", borderRadius: "50%", background: "#fb923c", opacity: 0.18, display: "flex" }} />

                <div
                    style={{
                        position: "absolute",
                        top: "32px",
                        bottom: "32px",
                        left: "32px",
                        right: "32px",
                        border: "1px solid rgba(138, 135, 132, 0.15)",
                        display: "flex",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: "44px",
                        left: "48px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex" }} />
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#a8a29e", letterSpacing: "2.5px", textTransform: "uppercase" as const }}>
                        by Fluxenta Technologies
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "18px",
                        zIndex: 1,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                        <span style={{ fontSize: "86px", fontWeight: 800, color: "#1A1A1A", letterSpacing: "-3px" }}>
                            pran
                        </span>
                        <span style={{ fontSize: "86px", fontWeight: 800, color: "#f97316", letterSpacing: "-3px" }}>
                            .ai
                        </span>
                    </div>

                    <div
                        style={{
                            fontSize: "20px",
                            fontWeight: 400,
                            color: "#78716c",
                            letterSpacing: "6px",
                            textTransform: "uppercase" as const,
                            display: "flex",
                        }}
                    >
                        AI-Powered Digital Workforce
                    </div>

                    <div
                        style={{
                            width: "80px",
                            height: "3px",
                            background: "linear-gradient(90deg, #f97316, #fb923c)",
                            borderRadius: "2px",
                            marginTop: "6px",
                            display: "flex",
                        }}
                    />

                    <div
                        style={{
                            fontSize: "15px",
                            fontWeight: 400,
                            color: "#a8a29e",
                            marginTop: "10px",
                            display: "flex",
                            letterSpacing: "0.5px",
                        }}
                    >
                        Voice agents that speak any language you want &bull; &lt;500ms latency
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: "44px",
                        right: "48px",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#d6d3d1",
                        letterSpacing: "1px",
                        display: "flex",
                    }}
                >
                    fluxenta.dev/pranai
                </div>
            </div>
        ),
        { ...size }
    );
}
