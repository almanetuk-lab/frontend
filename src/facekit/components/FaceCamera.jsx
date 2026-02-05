import React, { useRef, useEffect } from "react";
import { useFaceDetection } from "../hooks/useFaceDetection";

export default function FaceCamera({ onResult, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const { ready, detect } = useFaceDetection();

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch(() => {});
      };
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/png");

    if (ready) {
      const res = await detect(image);
      if (res) {
        onResult({ ...res, image });
      }
    }

    onClose();
  };

  return (
    <div style={overlay}>
      <div style={box}>
        <video ref={videoRef} autoPlay style={{ width: 300 }} />
        <canvas ref={canvasRef} hidden />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={capture}>Capture</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const box = {
  background: "#fff",
  padding: 16,
  borderRadius: 8,
};
