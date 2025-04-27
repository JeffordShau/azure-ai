"use client";
import { useState } from "react";
import ScriptInput from "./components/ScriptInput";
import AudioRecorder from "./components/AudioRecorder";
import AudioPlayer from "./components/AudioPlayer";
import Submit from "./components/Submit";
import Image from "next/image";

export default function Home() {

  const [script, setScript] = useState('おはいようございます。');
  const [result, setResult] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const handleAudioRecorded = (blob) => {
    setAudioBlob(blob);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ScriptInput script={script} setScript={setScript} />
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      <AudioPlayer audioBlob={audioBlob} />
      <Submit script={script} audioBlob={audioBlob} onResultsReceived={setResult} />
    </main>
  );
}

// {results && (
//   <div className="mt-6 w-full p-4 bg-gray-800 rounded-md">
//   <h3 className="text-lg font-medium mb-2">Assessment Results</h3>
//   <div className="grid grid-cols-2 gap-2">
//       <div className="p-2 bg-gray-700 rounded">
//       <p>Accuracy Score: {results.accuracyScore}</p>
//       </div>
//       <div className="p-2 bg-gray-700 rounded">
//       <p>Fluency Score: {results.fluencyScore}</p>
//       </div>
//       <div className="p-2 bg-gray-700 rounded">
//       <p>Completeness: {results.completenessScore}</p>
//       </div>
//       <div className="p-2 bg-gray-700 rounded">
//       <p>Pronunciation: {results.pronunciationScore}</p>
//       </div>
//   </div>
//   </div>
// )}