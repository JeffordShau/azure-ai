'use client';

export default function ScriptInput({ script, setScript }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2-gap-8">
            <h2 className="text-lg font-medium mb-2">
            Script
            </h2>
            <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-40 p-4 bg-gray-900 border border-gray-700 rounded-md resize-none"
                placeholder="Enter your script here..."
            />
        </div>
    )
}