"use client";

import { useState, useEffect } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export default function DownloadButtons({ src }) {
  const [isProcessing, setIsProcessing] = useState(null); // null | "mp3" | "wav"
  const [ffmpeg, setFfmpeg] = useState(null);

  useEffect(() => {
    const loadFfmpeg = async () => {
      const ffmpegInstance = new FFmpeg();
      await ffmpegInstance.load();
      setFfmpeg(ffmpegInstance);
    };
    loadFfmpeg();
  }, []);

  const convertAndDownload = async (format) => {
    if (!ffmpeg || !src || isProcessing) return;

    setIsProcessing(format);

    const inputName = "input_audio";
    const outputName = `output.${format}`;

    try {
      // Load input file fresh each time
      const audioData = await fetchFile(src);
      await ffmpeg.writeFile(inputName, audioData);

      // Delete old output file if exists
      try {
        await ffmpeg.deleteFile(outputName);
      } catch (e) {}

      // Convert
      await ffmpeg.exec([
        "-i",
        inputName,
        "-vn",
        "-ar",
        "44100",
        "-ac",
        "2",
        "-b:a",
        "192k",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);

      const blob = new Blob([data.buffer], {
        type: format === "mp3" ? "audio/mpeg" : "audio/wav",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audio.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error converting the file!");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={() => convertAndDownload("mp3")}
        disabled={!!isProcessing}
        className={`flex-1 py-3 rounded-lg font-medium text-white transition ${
          isProcessing === "mp3"
            ? "bg-green-700 cursor-wait"
            : "bg-green-600 hover:bg-green-700"
        } disabled:opacity-50`}
      >
        {isProcessing === "mp3" ? "Creating MP3..." : "Download MP3"}
      </button>

      <button
        onClick={() => convertAndDownload("wav")}
        disabled={!!isProcessing}
        className={`flex-1 py-3 rounded-lg font-medium text-white transition ${
          isProcessing === "wav"
            ? "bg-purple-700 cursor-wait"
            : "bg-purple-600 hover:bg-purple-700"
        } disabled:opacity-50`}
      >
        {isProcessing === "wav" ? "Creating WAV..." : "Download WAV"}
      </button>
    </div>
  );
}
