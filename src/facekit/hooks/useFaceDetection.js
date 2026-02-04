import { useEffect, useState } from "react";
import { loadFaceModels, detectAgeGender } from "../services/faceDetection";

export const useFaceDetection = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadFaceModels().then(() => setReady(true));
  }, []);

  const detect = async (image) => {
    if (!ready) return null;
    return await detectAgeGender(image);
  };

  return { ready, detect };
};
