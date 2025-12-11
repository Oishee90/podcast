"use client";
import { useState, useRef, useEffect } from "react";
import FileUpload from "../FileUpload";
import LoadingBars from "../../component/home/LoadingBars";
import AudioPlayer from "../AudioPlayer";
import DownloadButtons from "./DownloadButtons";
import api from "@/lib/axios";
import image from "../../../public/MacBook Pro 14_ - 3.webp";
import Image from "next/image";
import { PiWaveform } from "react-icons/pi";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
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
    <div className="min-h-screen  flex items-center justify-center p-4 relative roboto">
      <Toaster position="top-center" />
      {/* Background microphone image with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background Image with dark overlay */}
        <Image
          src={image}
          alt="Podcast microphone"
          className="w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />

        {/* Dark overlay to dim the image */}
        {/* <div className="absolute inset-0 " style={{ zIndex: 1 }} /> */}

        {/* Light Rays on top */}
        {/* <div className="absolute inset-0" style={{ zIndex: 2 }}>
    <LightRays
      raysOrigin="right"
      raysColor="#00ffff"
      raysSpeed={1.5}
      lightSpread={1.8}
      rayLength={1.2}
      followMouse={true}
      mouseInfluence={0.1}
      noiseAmount={0.1}
      distortion={0.05}
      className="w-full h-full pointer-events-none"
    />
  </div> */}
      </div>

      <Navbar></Navbar>
      {/* Main modal-like container */}
      <div className="relative bg-[#2E2E2E80]  backdrop-blur-md  bg-opacity-60  rounded-xl p-6 max-w-5xl w-full shadow-2xl">
        {/* Header with icon */}
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
            <PiWaveform size={26} className="text-[#439CBF] neutont" /> Trim
            Your Audio to Its Best
          </h1>
          <p className="text-gray-300 mb-2 text-sm mt-3">
            Upload MP3 or WAV Files up to 30 Minutes
          </p>
        </div>

        {/* Upload area */}
        <div className=" rounded-lg py-4 mb-4 text-center">
          <FileUpload
            onUpload={(file) => {
              if (!file) return;

              const fileSizeMB = file.size / (1024 * 1024);
              const fileType = file.type;

              // MP3 limit
              if (fileType === "audio/mpeg" && fileSizeMB > 25) {
                toast.error("MP3 file cannot be larger than 25 MB!");
                return;
              }

              // WAV limit
              if (fileType === "audio/wav" && fileSizeMB > 200) {
                toast.error("WAV file cannot be larger than 200 MB!");
                return;
              }

              setUploadedFile(file);
              handleTrim(file);
            }}
            resetAll={resetAll}
          />
        </div>

        {/* Loading or Preview */}
        {loading && (
          <LoadingBars
            progress={progress}
            status={status}
            onComplete={() => setLoading(false)}
            className="mb-4"
          />
        )}

        {!loading && trimmedAudio && (
          <div className="mb-4">
            <p className="text-gray-200 mb-2 font-bold neutont text-xl">
              Trimmed Audio preview
            </p>
            <div className="bg-transparent rounded-lg p-3 border border-[#9fe0fa33]">
              <AudioPlayer src={trimmedAudio} />
            </div>
          </div>
        )}

        {/* Download buttons */}
        {!loading && trimmedAudio && (
          <div className="space-x-2">
            <DownloadButtons
              src={trimmedAudio}
              format="MP3"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
