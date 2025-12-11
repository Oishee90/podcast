"use client";

import { useState, useRef, useEffect } from "react";
import FileUpload from "../FileUpload";
import LoadingBars from "../../component/home/LoadingBars";
import AudioPlayer from "../AudioPlayer";
import DownloadButtons from "./DownloadButtons";

import api from "@/lib/axios";

const Upload = () => {
     const [uploadedFile, setUploadedFile] = useState(null);
  const [trimmedAudio, setTrimmedAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [progress, setProgress] = useState(0); // <-- NEW

  const abortController = useRef(null);
  const statusInterval = useRef(null);

  const resetAll = () => {
    if (abortController.current) abortController.current.abort();
    if (statusInterval.current) clearInterval(statusInterval.current);

    setUploadedFile(null);
    setTrimmedAudio(null);
    setLoading(false);
    setStatus("");
    setTaskId(null);
    setProgress(0);
  };

  const handleTrim = async (file) => {
    if (!file) return;

    abortController.current = new AbortController();
    setLoading(true);
    setTrimmedAudio(null);
    setStatus("processing");
    setProgress(5);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await api.post("/ai/summarize-audio/", formData, {
        signal: abortController.current.signal,
      });

      if (response?.data?.task_id) {
        const id = response.data.task_id;
        setTaskId(id);

        statusInterval.current = setInterval(() => checkStatus(id), 2000);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        console.log("🔴 Request aborted");
      } else {
        console.error(err);
      }
      setLoading(false);
      setStatus("");
      setProgress(0);
    }
  };

  const checkStatus = async (id) => {
    try {
      const response = await api.get(`/ai/summarize-audio-status/${id}/`);
      const data = response.data;

      // 🔵 Increase progress WHILE backend is processing or pending
      if (data.status === "processing" || data.status === "PENDING") {
        setProgress((p) => (p < 95 ? p + 5 : p));
      }

      if (data.status === "completed" && data?.output_audio) {
        setTrimmedAudio(data?.output_audio);
        setStatus("complete");
        setLoading(false);
        setProgress(100);

        clearInterval(statusInterval.current);
      } else if (data.status === "PENDING") {
        setStatus("pending"); // update UI
      } else if (data.status === "processing") {
        setStatus("processing");
      } else {
        console.warn("Unknown status:", data.status);
      }
    } catch (err) {
      console.error(err);
      clearInterval(statusInterval.current);
      setLoading(false);
      setStatus("error");
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (statusInterval.current) clearInterval(statusInterval.current);
    };
  }, []);
    return (
        <div className="min-h-screen justify-center bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-3xl w-full bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          🎵 AI Audio Trimmer
        </h1>

        <FileUpload
          onUpload={(file) => {
            setUploadedFile(file);
            handleTrim(file);
          }}
          resetAll={resetAll}
        />

        {/* {status && (
          <p className="text-center mt-4">
            <span
              className={
                status === "complete"
                  ? "text-green-600"
                  : status === "processing"
                  ? "text-blue-600"
                  : "text-yellow-600"
              }
            >
              {status.toUpperCase()}
            </span>
          </p>
        )} */}

        {/* 🔵 BEAUTIFUL PODCAST LOADING EFFECT */}
        {loading && (
          <LoadingBars
            progress={progress}
            status={status}
            onComplete={() => setLoading(false)} // loader hides after Done message
          />
        )}

        {!loading && trimmedAudio && (
          <div className="mt-6">
            <AudioPlayer src={trimmedAudio} />
            <DownloadButtons src={trimmedAudio} />
          </div>
        )}
      </div>

    </div>
    );
}

export default Upload;
