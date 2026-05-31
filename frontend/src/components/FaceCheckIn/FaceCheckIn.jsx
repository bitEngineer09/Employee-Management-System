import React, { useRef, useState, useEffect, useCallback } from "react";
import * as faceapi from "face-api.js";
import { Camera, Loader2, CheckCircle2, AlertCircle, MapPin, Scan } from "lucide-react";
import useFaceModels from "./useFaceModels";

const FaceCheckIn = ({ onSubmit, isLoading = false, mode = "checkin" }) => {
    const videoRef = useRef(null); // Reference to the video element for webcam stream, so user can see their camera feed and position their face correctly.
    const canvasRef = useRef(null);
    const streamRef = useRef(null); // streamRef stores the camera stream returned by getUserMedia(). I use it later to stop the camera tracks when the user cancels or after attendance is marked.

    const { modelsLoaded, error: modelError } = useFaceModels(); // Custom hook to load face-api.js models. It returns whether the models are loaded and if there was an error during loading.
    const [cameraOn, setCameraOn] = useState(false);
    const [capturing, setCapturing] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");
    const [statusType, setStatusType] = useState("idle"); // idle | info | success | error

    const isCheckin = mode === "checkin";
    const buttonLabel = isCheckin ? "Check In" : "Check Out";
    const accentClass = isCheckin ? "text-green-400" : "text-blue-400";
    const buttonBg = isCheckin
        ? "bg-green-500 hover:bg-green-600"
        : "bg-blue-500 hover:bg-blue-600";

    // Start webcam stream
    const startCamera = useCallback(async () => { // used callback to memoize the function and prevent unnecessary re-renders. This function is called when the user clicks "Open Camera". It requests webcam access, sets the video element's srcObject to the stream, and updates state to show the camera feed.
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ // asks browser for webcam access. If granted, it returns a MediaStream object which we can set as the source for our video element to show the live camera feed.
                video: {
                    facingMode: "user", // front camera
                    width: 320, height: 240 // resolution for faster processing. We don't need high res for face detection, and lower res means faster detection and less CPU usage.
                },
            });
            streamRef.current = stream; // store the stream in a ref so we can stop it later. We can't put the stream in state because it's not serializable and would cause issues with React's rendering.
            if (videoRef.current) {
                videoRef.current.srcObject = stream; // attach the stream to the <video> element so the user can see the live camera preview.
            }
            setCameraOn(true);
            setStatusMsg("Camera ready. Position your face and click capture.");
            setStatusType("info");
        } catch {
            console.error("Camera Error:", err);

            setStatusMsg(
                err.message || "Failed to access camera"
            );
            setStatusType("error");
        }
    }, []);

    // Stop webcam stream
    const stopCamera = useCallback(() => {
        if (streamRef.current) { // checks if there is an active stream.
            streamRef.current.getTracks().forEach((t) => t.stop()); // stops all tracks in the stream.
            streamRef.current = null; // clear the ref since the stream is no longer active.
        }
        setCameraOn(false);
        setStatusMsg("");
        setStatusType("idle");
    }, []);

    // Clean up on unmount
    useEffect(() => () => stopCamera(), [stopCamera]); // cleanup effect to automatically stop the webcam when the component unmounts. This prevents memory leaks and avoids keeping the user's camera active unnecessarily.

    // Get current geolocation
    const getLocation = () =>
        new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported by this browser."));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => reject(new Error("Location access denied. Please enable location.")),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });

    // Capture face and location, then call onSubmit
    const handleCapture = async () => {
        if (!videoRef.current || !modelsLoaded) return; // ensures camera is running, and models are loaded.

        setCapturing(true);
        setStatusMsg("Detecting face…");
        setStatusType("info");

        try {
            // 1. Detect face and extract descriptor
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()) // detects a single face in the video feed using the Tiny Face Detector model, which is faster and less resource-intensive than the full SSD Mobilenet model.
                .withFaceLandmarks() // detects facial landmarks (eyes, nose, mouth, etc.) 
                .withFaceDescriptor(); // generates a face descriptor, which is a numerical representation of the detected face's features.

            if (!detection) {
                setStatusMsg("No face detected. Please ensure your face is visible and well-lit.");
                setStatusType("error");
                setCapturing(false);
                return;
            }

            const faceDescriptor = Array.from(detection.descriptor); // convert the Float32Array descriptor to a regular array so it can be sent in JSON to the backend.

            // 2. Capture device info
            const deviceInfo = navigator.userAgent; // captures the user's device information from the browser's user agent string. This can be useful for logging and debugging purposes, to know what kind of device and browser the user is using when they check in or out.

            // 3. For check-in: require face. For check-out just get location.
            let lat, lng;
            setStatusMsg("Getting your location…");
            try {
                ({ lat, lng } = await getLocation()); // gets the user's current geolocation coordinates.
            } catch (locErr) { // if location access is denied or fails
                setStatusMsg(locErr.message);
                setStatusType("error");
                setCapturing(false);
                return;
            }

            setStatusMsg("Submitting…");
            stopCamera();

            await onSubmit({ faceDescriptor, lat, lng, deviceInfo }); // data sent to parent component (Attendance.jsx) which calls the API to mark attendance.

            setStatusMsg(`${buttonLabel} successful!`);
            setStatusType("success");
        } catch (err) {
            console.error("FaceCheckIn capture error", err);
            setStatusMsg(err?.response?.data?.message || "Something went wrong. Please try again.");
            setStatusType("error");
        } finally {
            setCapturing(false);
        }
    };

    const statusIcon = {
        info: <Loader2 size={14} className="animate-spin inline mr-1" />,
        success: <CheckCircle2 size={14} className="inline mr-1 text-green-400" />,
        error: <AlertCircle size={14} className="inline mr-1 text-red-400" />,
        idle: null,
    }[statusType];

    const statusColor = {
        info: "text-blue-300",
        success: "text-green-400",
        error: "text-red-400",
        idle: "",
    }[statusType];

    return (
        <div className="flex flex-col items-center gap-4 p-5 rounded-xl border border-(--border-primary) bg-modal-gradient min-w-[260px]">
            {/* Header */}
            <div className={`flex items-center gap-2 font-semibold text-white`}>
                <Scan size={18} className={accentClass} />
                <span>{buttonLabel}</span>
            </div>

            {/* Model loading state */}
            {modelError ? (
                <p className="text-xs text-red-400 text-center">{modelError}</p>
            ) : !modelsLoaded ? (
                <p className="text-xs text-blue-300 flex items-center gap-1">
                    <Loader2 size={13} className="animate-spin" /> Loading face models…
                </p>
            ) : null}

            {/* Camera viewport */}
            <div className="relative w-[240px] h-[180px] rounded-lg overflow-hidden bg-black/40 border border-white/10">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-300 ${cameraOn ? "opacity-100" : "opacity-0"}`}
                />
                <canvas ref={canvasRef} className="absolute inset-0 hidden" />
                {!cameraOn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
                        <Camera size={36} />
                        <p className="text-xs">Camera off</p>
                    </div>
                )}
            </div>

            {/* Status message */}
            {statusMsg && (
                <p className={`text-xs text-center ${statusColor}`}>
                    {statusIcon}
                    {statusMsg}
                </p>
            )}

            {/* Location notice */}
            <p className="text-xs text-(--text-tertiary) flex items-center gap-1">
                <MapPin size={11} />
                Location will be captured automatically
            </p>

            {/* Action buttons */}
            <div className="flex gap-3">
                {!cameraOn ? (
                    <button
                        onClick={startCamera}
                        disabled={!modelsLoaded || !!modelError || isLoading}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        Open Camera
                    </button>
                ) : (
                    <>
                        <button
                            onClick={stopCamera}
                            className="px-3 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCapture}
                            disabled={capturing || isLoading}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${buttonBg}`}
                        >
                            {capturing || isLoading ? (
                                <span className="flex items-center gap-1">
                                    <Loader2 size={14} className="animate-spin" />
                                    Processing…
                                </span>
                            ) : (
                                `Capture & ${buttonLabel}`
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FaceCheckIn;
