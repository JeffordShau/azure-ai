import React, { useRef, useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

export default function AudioRecorder({ onBlob }) {
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
    const [recordingTime, setRecordingTime] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
    if (status === 'recording') {
        timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } else {
        clearInterval(timerRef.current);
        setRecordingTime(0);
    }
        return () => clearInterval(timerRef.current);
    }, [status]);

    useEffect(() => {
        if (mediaBlobUrl && onBlob) {
        fetch(mediaBlobUrl)
            .then(r => r.blob())
            .then(onBlob);
        }
    }, [mediaBlobUrl, onBlob]);

    return (
        <div>
        <button onClick={status === 'recording' ? stopRecording : startRecording}>
            {status === 'recording' ? 'Stop Recording' : 'Start Recording'}
        </button>
        {status === 'recording' && <span> Recording: {recordingTime}s </span>}
        {mediaBlobUrl && <audio src={mediaBlobUrl} controls />}
        </div>
    );
}
