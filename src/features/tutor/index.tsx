/**
 * Tutor Feature Module
 * Provides tutor context and state management
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TutorState {
  isActive: boolean;
  currentQuestion: string | null;
  tutorResponse: string | null;
  isProcessing: boolean;
}

interface TutorConfig {
  voice?: string;
  responseModality?: string;
  [key: string]: any;
}

interface TutorContextType {
  state: TutorState;
  config: TutorConfig;
  connected: boolean;
  client: any;
  setActive: (active: boolean) => void;
  setCurrentQuestion: (question: string | null) => void;
  setTutorResponse: (response: string | null) => void;
  setProcessing: (processing: boolean) => void;
  setConfig: (config: TutorConfig) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  interruptAudio: () => void;
}

const TutorContext = createContext<TutorContextType | undefined>(undefined);

export const useTutor = () => {
  const context = useContext(TutorContext);
  if (!context) {
    throw new Error('useTutor must be used within a TutorProvider');
  }
  return context;
};

export const useTutorContext = useTutor;

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private eventListeners: Map<string, Function[]> = new Map();

  start(deviceId?: string): AudioRecorder {
    const constraints: MediaStreamConstraints = {
      audio: deviceId ? { deviceId: { exact: deviceId } } : true,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
        this.emit('data', event.data);
      };

      this.mediaRecorder.start();
    }).catch((error) => {
      console.error('Failed to start audio recorder:', error);
    });

    return this;
  }

  stop(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.mediaRecorder = null;
    }
  }

  on(event: string, listener: Function): AudioRecorder {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(listener);
    return this;
  }

  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }
}

interface TutorProviderProps {
  children: ReactNode;
}

export const TutorProvider: React.FC<TutorProviderProps> = ({ children }) => {
  const [state, setState] = useState<TutorState>({
    isActive: false,
    currentQuestion: null,
    tutorResponse: null,
    isProcessing: false,
  });

  const [config, setConfig] = useState<TutorConfig>({});
  const [connected, setConnected] = useState(false);
  const [client] = useState<any>(null);

  const setActive = (active: boolean) => {
    setState(prev => ({ ...prev, isActive: active }));
  };

  const setCurrentQuestion = (question: string | null) => {
    setState(prev => ({ ...prev, currentQuestion: question }));
  };

  const setTutorResponse = (response: string | null) => {
    setState(prev => ({ ...prev, tutorResponse: response }));
  };

  const setProcessing = (processing: boolean) => {
    setState(prev => ({ ...prev, isProcessing: processing }));
  };

  const connect = async () => {
    setConnected(true);
  };

  const disconnect = () => {
    setConnected(false);
  };

  const interruptAudio = () => {
  };

  const value: TutorContextType = {
    state,
    config,
    connected,
    client,
    setActive,
    setCurrentQuestion,
    setTutorResponse,
    setProcessing,
    setConfig,
    connect,
    disconnect,
    interruptAudio,
  };

  return <TutorContext.Provider value={value}>{children}</TutorContext.Provider>;
};
