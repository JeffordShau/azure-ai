'use client';

import { useState } from 'react';
import { sendToAPI } from '@lib/sendToAPI';
import Image from 'next/image';

export default function Submit({ script, audioBlob, onResultsReceived }) {

    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async () => {
        if (!audioBlob) return;
        setIsProcessing(true);
        try {
            const result = await sendToAPI(audioBlob, script, 'ja-JP');
            onScoreReceived(result);
        } 
        catch (error) {
            console.error('Error submitting audio:', error);
            alert('Failed to process audio. Please try again.');
        } 
        finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {audioBlob && (
                <button
                    onClick={handleSubmit}
                    disabled={!audioBlob}
                    className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                    {!isProcessing ? 'Submit' : 'Processing...'}
                </button>
                )}
        </>
    )
}