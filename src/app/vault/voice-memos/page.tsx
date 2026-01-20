"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Button from "@/components/ui/button";

type VoiceMemo = {
  id: string;
  title: string;
  transcript?: string;
  audioUrl: string;
  duration: number;
  createdAt: string;
  category?: string;
};

export default function VoiceMemosPage() {
  const [memos, setMemos] = useState<VoiceMemo[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadMemos();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadMemos = async () => {
    try {
      const res = await fetch("/api/vault/voice-memos");
      if (res.ok) {
        const data = await res.json();
        setMemos(data.memos || []);
      }
    } catch (error) {
      console.error("Failed to load memos:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await uploadAndTranscribe(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Microphone access denied or not available");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const uploadAndTranscribe = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "memo.webm");

      const res = await fetch("/api/vault/voice-memos/transcribe", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await loadMemos();
      }
    } catch (error) {
      console.error("Failed to transcribe:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteMemo = async (id: string) => {
    try {
      const res = await fetch(`/api/vault/voice-memos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMemos((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete memo:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/vault"
            className="text-sm text-pink-400 hover:text-pink-300 transition mb-4 inline-block"
          >
            ← Back to Sacred Vault
          </Link>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Voice Memos
          </h1>
          <p className="text-xl text-gray-400">
            Post-appointment brain dump → transcribed, organized, and searchable. Just talk.
          </p>
        </div>

        {/* Recording Interface */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl border border-white/10 p-8 mb-8">
          <div className="text-center">
            {!isRecording && !isProcessing && (
              <>
                <div className="text-6xl mb-4">🎙️</div>
                <h2 className="text-2xl font-semibold mb-2">Record a Voice Memo</h2>
                <p className="text-gray-400 mb-6">
                  Capture your thoughts right after an appointment
                </p>
                <Button onClick={startRecording} size="lg">
                  Start Recording
                </Button>
              </>
            )}

            {isRecording && (
              <>
                <div className="text-6xl mb-4 animate-pulse">🔴</div>
                <h2 className="text-2xl font-semibold mb-2">Recording...</h2>
                <p className="text-4xl font-mono mb-6">{formatTime(recordingTime)}</p>
                <Button onClick={stopRecording} variant="ghost">
                  Stop Recording
                </Button>
              </>
            )}

            {isProcessing && (
              <>
                <div className="text-6xl mb-4">⚙️</div>
                <h2 className="text-2xl font-semibold mb-2">Processing...</h2>
                <p className="text-gray-400">Transcribing your memo</p>
              </>
            )}
          </div>
        </div>

        {/* Memos List */}
        {memos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Your Memos</h2>
            {memos.map((memo) => (
              <div
                key={memo.id}
                className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{memo.title}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(memo.createdAt).toLocaleDateString()} • {formatTime(memo.duration)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMemo(memo.id)}
                  >
                    Delete
                  </Button>
                </div>

                {memo.transcript && (
                  <div className="bg-black/30 rounded-lg p-4 mb-3">
                    <p className="text-sm leading-relaxed">{memo.transcript}</p>
                  </div>
                )}

                <audio controls className="w-full">
                  <source src={memo.audioUrl} type="audio/webm" />
                  Your browser does not support audio playback.
                </audio>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
