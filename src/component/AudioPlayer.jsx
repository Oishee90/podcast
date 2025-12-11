export default function AudioPlayer({ src }) {
  return (
    <div className="rounded-xl shadow-sm custom-audio-player">
      <audio controls src={src} className="w-full "></audio>
    </div>
  );
}
