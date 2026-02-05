import * as faceapi from "face-api.js";

let loaded = false;

export const loadFaceModels = async () => {
  if (loaded) return;

  const MODEL_URL = "/models";

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(
      `${MODEL_URL}/tiny_face_detector_model`
    ),
    faceapi.nets.ageGenderNet.loadFromUri(
      `${MODEL_URL}/age_gender_model`
    ),
  ]);

  loaded = true;
  console.log("✅ Face API models loaded");
};

export const detectAgeGender = async (imageSrc) => {
  const img = await faceapi.fetchImage(imageSrc);

  const result = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withAgeAndGender();

  if (!result) return null;

  return {
    age: Math.round(result.age),
    gender: result.gender === "male" ? "Male" : "Female",
  };
};
