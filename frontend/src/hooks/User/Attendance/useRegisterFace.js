import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { registerFaceApi } from "../../../api/attendance.api";

/**
 * useRegisterFace
 * Sends a 128-element face descriptor to the backend for storage.
 * Usage: const { registerFace, isLoading } = useRegisterFace();
 *        registerFace(descriptorArray);
 */
const useRegisterFace = () => {
    const { mutate, isPending, error } = useMutation({
        mutationFn: (faceDescriptor) => registerFaceApi(faceDescriptor),
        onSuccess: () => {
            toast.success("Face registered successfully!");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to register face");
            console.error("useRegisterFace error", error?.response?.data || error);
        },
    });

    return {
        registerFace: mutate,
        isLoading: isPending,
        error,
    };
};

export default useRegisterFace;
