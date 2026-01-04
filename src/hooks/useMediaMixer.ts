/**
 * Media Mixer Hook
 * Mixes camera, screen, and scratchpad into single canvas stream
 */

import { useRef, useState, useCallback, useEffect } from 'react';

export interface UseMediaMixerOptions {
  width?: number;
  height?: number;
  fps?: number;
  cameraVideoRef?: React.RefObject<HTMLVideoElement>;
  screenVideoRef?: React.RefObject<HTMLVideoElement>;
}

export function useMediaMixer(options: UseMediaMixerOptions = {}) {
  const {
    width = 1280,
    height = 720,
    fps = 2,
    cameraVideoRef,
    screenVideoRef,
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const scratchpadFrameRef = useRef<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastDrawTimeRef = useRef<number>(0);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const cameraVideo = cameraVideoRef?.current;
    const screenVideo = screenVideoRef?.current;

    if (screenVideo && screenVideo.readyState === 4) {
      ctx.drawImage(screenVideo, 0, 0, width, height);
    }

    if (cameraVideo && cameraVideo.readyState === 4) {
      const cameraWidth = 320;
      const cameraHeight = 240;
      ctx.drawImage(
        cameraVideo,
        width - cameraWidth - 20,
        height - cameraHeight - 20,
        cameraWidth,
        cameraHeight
      );
    }

    if (scratchpadFrameRef.current) {
      const img = new Image();
      img.src = scratchpadFrameRef.current;
      ctx.drawImage(img, 0, height - 200, 400, 200);
    }
  }, [width, height, cameraVideoRef, screenVideoRef]);

  const animate = useCallback((timestamp: number) => {
    if (!isRunning) return;

    const frameInterval = 1000 / fps;

    if (timestamp - lastDrawTimeRef.current >= frameInterval) {
      drawFrame();
      lastDrawTimeRef.current = timestamp;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isRunning, fps, drawFrame]);

  useEffect(() => {
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, animate]);

  const updateScratchpadFrame = useCallback((dataUrl: string) => {
    scratchpadFrameRef.current = dataUrl;
  }, []);

  const getCanvasStream = useCallback((): MediaStream | null => {
    if (!canvasRef.current) return null;
    return canvasRef.current.captureStream(fps);
  }, [fps]);

  const getCanvasDataURL = useCallback((): string => {
    if (!canvasRef.current) return '';
    return canvasRef.current.toDataURL('image/jpeg', 0.8);
  }, []);

  return {
    canvasRef,
    isRunning,
    setIsRunning,
    updateScratchpadFrame,
    getCanvasStream,
    getCanvasDataURL,
    drawFrame,
  };
}
