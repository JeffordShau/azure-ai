import React from 'react';

const AudioPlayer = ({ audioBlob }) => {
    if (!audioBlob) return null;

    return (
    <>
        <h2 className="text-lg font-medium mt-4 mb-2">Recorded Audio</h2>
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
                <audio 
                    controls 
                    src={URL.createObjectURL(audioBlob)}
                    className="w-full max-w-md"
                >
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    </>
    );
};

export default AudioPlayer;