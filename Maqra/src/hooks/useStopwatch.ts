import { useState, useEffect, useRef } from 'react';
import * as Haptics from 'expo-haptics';

export function useStopwatch() {
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    if (!isRunning) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const pause = () => {
    if (isRunning) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const stop = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const reset = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setElapsedTime(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { elapsedTime, isRunning, start, pause, stop, reset };
}
