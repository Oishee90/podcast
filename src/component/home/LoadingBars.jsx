import { useEffect, useState } from "react";

export default function LoadingBars({ progress, status, onComplete }) {
  const [showDone, setShowDone] = useState(false);

  const label =
    status === "processing"
      ? "Processing"
      : status === "pending"
      ? "Pending"
      : status === "complete"
      ? showDone
        ? "Done!"
        : "Complete"
      : "Loading";

  const color =
    status === "complete"
      ? "text-green-600"
      : status === "pending"
      ? "text-yellow-600"
      : "text-[#439CBF]";

  const barColor =
    status === "complete"
      ? "bg-green-500"
      : status === "pending"
      ? "bg-yellow-500"
      : "bg-[#439CBF]";

  // Show "Done!" for 2 sec after complete, then call onComplete
  useEffect(() => {
    if (status === "complete") {
      setShowDone(true);
      const timer = setTimeout(() => {
        setShowDone(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, onComplete]);

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {/* Sound Bars */}
      <div className="flex items-end gap-1">
        <div className={`w-2 h-6 rounded animate-pulse ${barColor}`} style={{ animationDuration: "0.6s" }} />
        <div className={`w-2 h-10 rounded animate-pulse ${barColor}`} style={{ animationDuration: "0.45s" }} />
        <div className={`w-2 h-7 rounded animate-pulse ${barColor}`} style={{ animationDuration: "0.55s" }} />
        <div className={`w-2 h-12 rounded animate-pulse ${barColor}`} style={{ animationDuration: "0.4s" }} />
        <div className={`w-2 h-8 rounded animate-pulse ${barColor}`} style={{ animationDuration: "0.5s" }} />
      </div>

      {/* Status Text */}
      <p className={`${color} font-semibold text-lg tracking-wide`}>
        {label} {status !== "complete" && `… ${progress}%`}
      </p>

      {/* Progress Bar */}
      {status !== "complete" && (
        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
