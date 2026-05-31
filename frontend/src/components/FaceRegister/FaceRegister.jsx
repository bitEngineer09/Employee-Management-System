import React, { useRef, useState, useCallback, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Camera, ScanFace, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import useFaceModels from "../FaceCheckIn/useFaceModels";
import useRegisterFace from "../../hooks/User/Attendance/useRegisterFace";

/**
 * FaceRegister
 * Standalone face enrollment component.
 * Props:
 *   onSuccess() – called after successful registration (for redirect / modal close)
 */
const FaceRegister = ({ onSuccess }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const { modelsLoaded, error: modelError } = useFaceModels();
    const { registerFace, isLoading: registering } = useRegisterFace();

    const [cameraOn, setCameraOn] = useState(false);
    const [captured, setCaptured] = useState(false);          // snapshot visible
    const [descriptor, setDescriptor] = useState(null);       // 128-d array
    const [statusMsg, setStatusMsg] = useState("");
    const [statusType, setStatusType] = useState("idle");     // idle | info | success | error

    // ── Camera helpers ──────────────────────────────────────────
    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: 480, height: 360 },
            });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            setCameraOn(true);
            setCaptured(false);
            setDescriptor(null);
            setStatusMsg("Position your face clearly in the frame, then click Capture.");
            setStatusType("info");
        } catch {
            setStatusMsg("Camera access denied. Please allow camera permissions and try again.");
            setStatusType("error");
        }
    }, []);

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setCameraOn(false);
    }, []);

    useEffect(() => () => stopCamera(), [stopCamera]);

    // ── Capture snapshot → extract descriptor ────────────────────
    const handleCapture = async () => {
        if (!videoRef.current || !modelsLoaded) return;
        setStatusMsg("Detecting face…");
        setStatusType("info");

        // Draw snapshot to canvas
        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

        const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            setStatusMsg("No face detected. Make sure your face is well-lit and centred.");
            setStatusType("error");
            return;
        }

        setDescriptor(Array.from(detection.descriptor));
        setCaptured(true);
        stopCamera();
        setStatusMsg("Face captured! Review the snapshot then click Register Face.");
        setStatusType("success");
    };

    // ── Submit to backend ────────────────────────────────────────
    const handleRegister = () => {
        if (!descriptor) return;
        registerFace(descriptor, {
            onSuccess: () => {
                setStatusMsg("Face registered successfully!");
                setStatusType("success");
                onSuccess?.();
            },
            onError: (err) => {
                setStatusMsg(err?.response?.data?.message || "Registration failed. Try again.");
                setStatusType("error");
            },
        });
    };

    // ── Reset flow ───────────────────────────────────────────────
    const handleRetake = () => {
        setCaptured(false);
        setDescriptor(null);
        setStatusMsg("");
        setStatusType("idle");
        startCamera();
    };

    const statusColor = { info: "text-blue-300", success: "text-green-400", error: "text-red-400", idle: "text-(--text-tertiary)" }[statusType];
    const StatusIcon = { info: Loader2, success: CheckCircle2, error: AlertCircle, idle: null }[statusType];

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
            {/* Title */}
            <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-400">
                    <ScanFace size={22} />
                </div>
                <div>
                    <p className="font-semibold text-lg leading-none">Register Your Face</p>
                    <p className="text-xs text-(--text-tertiary) mt-0.5">Required before you can mark attendance</p>
                </div>
            </div>

            {/* Model loading */}
            {modelError && (
                <div className="w-full px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {modelError}
                </div>
            )}

            {/* Camera / snapshot viewport */}
            <div className="relative w-full rounded-xl overflow-hidden bg-black/40 border border-white/10 aspect-video">
                {/* Live feed */}
                <video
                    ref={videoRef}
                    autoPlay muted playsInline
                    className={`w-full h-full object-cover transition-opacity duration-300 ${cameraOn && !captured ? "opacity-100" : "opacity-0 absolute inset-0"}`}
                />
                {/* Captured snapshot */}
                <canvas
                    ref={canvasRef}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${captured ? "opacity-100" : "opacity-0 absolute inset-0"}`}
                />
                {/* Idle placeholder */}
                {!cameraOn && !captured && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/30">
                        <Camera size={48} />
                        <p className="text-sm">Camera preview will appear here</p>
                    </div>
                )}
                {/* Overlay corner brackets when camera is on */}
                {cameraOn && !captured && (
                    <>
                        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-blue-400/70 rounded-tl" />
                        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-blue-400/70 rounded-tr" />
                        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-blue-400/70 rounded-bl" />
                        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-blue-400/70 rounded-br" />
                    </>
                )}
                {/* Success overlay on snapshot */}
                {captured && (
                    <div className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={11} /> Captured
                    </div>
                )}
            </div>

            {/* Status message */}
            {statusMsg && (
                <p className={`text-sm text-center flex items-center gap-1.5 ${statusColor}`}>
                    {StatusIcon && <StatusIcon size={14} className={statusType === "info" ? "animate-spin" : ""} />}
                    {statusMsg}
                </p>
            )}

            {/* Loading models notice */}
            {!modelsLoaded && !modelError && (
                <p className="text-xs text-blue-300 flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin" /> Loading face recognition models…
                </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 w-full">
                {!cameraOn && !captured && (
                    <button
                        onClick={startCamera}
                        disabled={!modelsLoaded || !!modelError}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Camera size={16} /> Open Camera
                    </button>
                )}

                {cameraOn && !captured && (
                    <button
                        onClick={handleCapture}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-all"
                    >
                        <ScanFace size={16} /> Capture Face
                    </button>
                )}

                {captured && (
                    <>
                        <button
                            onClick={handleRetake}
                            disabled={registering}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-all disabled:opacity-40"
                        >
                            <RefreshCw size={15} /> Retake
                        </button>
                        <button
                            onClick={handleRegister}
                            disabled={registering}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all disabled:opacity-50"
                        >
                            {registering
                                ? <><Loader2 size={15} className="animate-spin" /> Registering…</>
                                : <><CheckCircle2 size={15} /> Register Face</>
                            }
                        </button>
                    </>
                )}
            </div>

            {/* Steps hint */}
            <ol className="w-full space-y-1.5 text-xs text-(--text-tertiary) list-none">
                {[
                    ["1", "Open camera and face it directly"],
                    ["2", "Click Capture Face to take a snapshot"],
                    ["3", "Click Register Face to save your biometric"],
                ].map(([n, text]) => (
                    <li key={n} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-white/10 text-white/60 flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">{n}</span>
                        {text}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default FaceRegister;
