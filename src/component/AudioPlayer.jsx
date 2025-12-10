export default function AudioPlayer({ src }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
      <p className="text-gray-700 mb-2 font-medium">Trimmed Audio Preview</p>
      <audio controls src={src} className="w-full"></audio>
    </div>
  );
}
