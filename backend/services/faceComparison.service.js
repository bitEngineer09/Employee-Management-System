/**
 * Face Comparison Service
 * Compares two face descriptors using Euclidean distance.y
 */

// This is the maximum acceptable distance.
// Distance < 0.6 → Same person
// Distance > 0.6 → Different person
const FACE_MATCH_THRESHOLD = 0.6;


//Computes Euclidean distance between two 128-element descriptor arrays.

// This function calculates the Euclidean distance between two face descriptors.
// This function calculates how different two faces are.
export const euclideanDistance = (descriptor1, descriptor2) => {

    if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
        throw new Error("Invalid descriptors: must be equal-length arrays");
    }

    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        const diff = descriptor1[i] - descriptor2[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
};

//Compares two face descriptors.

export const compareFaces = (storedDescriptor, inputDescriptor) => {
    const distance = euclideanDistance(storedDescriptor, inputDescriptor);
    return {
        match: distance < FACE_MATCH_THRESHOLD,
        distance: Number(distance.toFixed(4)),
    };
};
