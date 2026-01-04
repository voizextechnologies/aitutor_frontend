/**
 * Media Capture Hook
 * Manages camera and screen capture
 */

import { useState, useRef, useCallback } from 'react';

export interface UseMediaCaptureOptions {
  videoWidth?: number;
  videoHeight?: number;
}

export function useMediaCapture(options: UseMediaCaptureOptions = {}) {
  const { videoWidth = 640, videoHeight = 480 } = options;

  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [screenEnabled, setScreenEnabled] = useState(false);

  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: videoWidth, height: videoHeight },
        audio: false,
      });

      cameraStreamRef.current = stream;

      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
        cameraVideoRef.current.play();
      }

      setCameraEnabled(true);
    } catch (error) {
      console.error('Failed to start camera:', error);
      setCameraEnabled(false);
    }
  }, [videoWidth, videoHeight]);

  const stopCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }

    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }

    setCameraEnabled(false);
  }, []);

  const startScreen = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: videoWidth, height: videoHeight },
        audio: false,
      });

      screenStreamRef.current = stream;

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
        screenVideoRef.current.play();
      }

      setScreenEnabled(true);

      stream.getVideoTracks()[0].onended = () => {
        stopScreen();
      };
    } catch (error) {
      console.error('Failed to start screen capture:', error);
      setScreenEnabled(false);
    }
  }, [videoWidth, videoHeight]);

  const stopScreen = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
    }

    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = null;
    }

    setScreenEnabled(false);
  }, []);

  const toggleCamera = useCallback(() => {
    if (cameraEnabled) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [cameraEnabled, startCamera, stopCamera]);

  const toggleScreen = useCallback(() => {
    if (screenEnabled) {
      stopScreen();
    } else {
      startScreen();
    }
  }, [screenEnabled, startScreen, stopScreen]);

  return {
    cameraEnabled,
    screenEnabled,
    cameraVideoRef,
    screenVideoRef,
    startCamera,
    stopCamera,
    startScreen,
    stopScreen,
    toggleCamera,
    toggleScreen,
  };
}
