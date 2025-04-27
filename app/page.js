"use client";
import { useState } from "react";
import ScriptInput from "./components/ScriptInput";
import Audio from "./components/Audio";
import Image from "next/image";

export default function Home() {

  const [script, setScript] = useState('おはいようございます。');

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2-gap-8">
        <h2 className="text-lg font-medium mb-2">
            Script
        </h2>
        <ScriptInput script={script} setScript={setScript} />
      </div>
      <div>
        <h2 className="text-lg font-medium mt-5 mb-2">
          Record or upload the audio of the script
        </h2>
        <Audio script={script} />
      </div>
    </main>
  );
}