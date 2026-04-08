"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface SessionTimerProps {
  durationMinutes: number;
  isPassive: boolean;
  onComplete: () => void;
  autoStart?: boolean;
}

export default function SessionTimer({
  durationMinutes,
  isPassive,
  onComplete,
  autoStart = false,
}: SessionTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setRemainingSeconds(durationMinutes * 60);
    setIsRunning(autoStart);
  }, [durationMinutes, autoStart]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          // Notify completion
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("BatchChef", {
              body: "Timer terminé ! Prochaine étape.",
              icon: "/favicon.ico",
            });
          }
          onCompleteRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progress = 1 - remainingSeconds / totalSeconds;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);

  const requestNotificationPermission = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular progress */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={isPassive ? "#587956" : "#ed7a0e"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-mono font-bold text-gray-900">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isRunning && remainingSeconds > 0 ? (
          <button
            onClick={() => {
              setIsRunning(true);
              requestNotificationPermission();
            }}
            className={`px-6 py-3 rounded-xl text-white font-semibold text-lg transition-colors ${
              isPassive
                ? "bg-sage-500 hover:bg-sage-600"
                : "bg-chef-500 hover:bg-chef-600"
            }`}
          >
            {remainingSeconds < totalSeconds ? "Reprendre" : "Démarrer"}
          </button>
        ) : isRunning ? (
          <button
            onClick={() => setIsRunning(false)}
            className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold text-lg hover:bg-gray-300 transition-colors"
          >
            Pause
          </button>
        ) : null}

        {remainingSeconds === 0 && (
          <div className="text-sage-600 font-semibold text-lg flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Terminé !
          </div>
        )}
      </div>
    </div>
  );
}
