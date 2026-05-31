import { useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

/**
 * Loads face-api.js models from /public/models/.
 * Returns { modelsLoaded, error }.
 */
const useFaceModels = () => {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([ // loads the necessary face recognition models in parallel. These models are required for detecting faces, identifying facial landmarks, and generating face descriptors.

                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL), // loads the Tiny Face Detector model, which is a lightweight and fast model for face detection.

                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL), // loads the Face Landmark model, which detects 68 specific points on the face (eyes, nose, mouth, etc.) that are used for accurate face recognition.

                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL), // loads the Face Recognition model, which generates a unique descriptor for each detected face.
                ]);
                setModelsLoaded(true);
            } catch (err) {
                console.error("useFaceModels: failed to load models", err);
                setError("Failed to load face recognition models. Make sure /public/models/ contains the Tiny Face Detector weight files.");
            }
        };
        loadModels();
    }, []);

    return { modelsLoaded, error };
};

export default useFaceModels;
