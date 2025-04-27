'use client';

export default function ScriptInput({ script, setScript }) {
    return (
        <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full h-64 p-4 bg-gray-900 border border-gray-700 rounded-md resize-none"
            placeholder="Enter your script here..."
        />
    )
}