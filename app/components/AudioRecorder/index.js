'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';


export default function AudioRecorder({ onAudioRecorded }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [loading, setLoading] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);
    const recordingChunksRef = useRef([]);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            // const setAudioDuration = () => setDuration(audio.duration || 0);
            const updateProgress = () => setTimeProgress(audio.currentTime || 0);
            // audio.addEventListener('loadedmetadata', setAudioDuration);
            audio.addEventListener('timeupdate', updateProgress);
            return () => {
                // audio.removeEventListener('loadedmetadata', setAudioDuration);
                audio.removeEventListener('timeupdate', updateProgress);
            }
        }
    }, [audioBlob])

    // start recording
    const startRecording= async () => {
        try {
            setRecordingTime(0);
            // set time elapsed to 0
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorderRef.current = new MediaRecorder(stream);
            recordingChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordingChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(recordingChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                onAudioRecorded(audioBlob); // Send the blob to parent component
            }

            mediaRecorderRef.current.start();
            setIsRecording(true);

            // start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }
        catch (error) {
            console.error('Error starting recording:' , error);
        }
    };

    // stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => {
                track.stop();
            });
            setIsRecording(false);
        }
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // upload audio
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        console.log('File:', file);
        console.log('File type:', file.type);
        if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
            setAudioBlob(file);
            onAudioRecorded(file);
            console.log('File uploaded:', file);
            // const reader = new FileReader();
            // reader.onloadend = () => {
            //     setAudioBlob(new Blob([reader.result], { type: 'audio/wav' }));
            // };
            // reader.readAsArrayBuffer(file);
        }
    }

    // handle audio progress
    const handleProgressChange = (e) => {
        const value = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
            setTimeProgress(value);
        }
    }

    // format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <>
            <h2 className="text-lg font-medium mt-5 mb-2">
                Record or upload the audio of the script
            </h2>
            <div className="flex flex-col items-center p-6 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="flex flex-col items-center">

                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`w-20 h-20 rounded-full flex items-center justify-center ${
                            isRecording ? 'bg-red-600' : 'bg-blue-600'
                            }`}
                        >
                            {isRecording ? (
                            <Image src="/stop.svg" alt="Pause Icon" width={32} height={32} />
                            ) : (
                            <Image src="/microphone.svg" alt="Microphone Icon" width={32} height={32} />
                            )}
                        </button>

                        <div className="mt-3 text-center">
                            <p>Record audio with microphone</p>
                            {isRecording && (
                            <p className="text-red-500 mt-1">Recording: {formatTime(recordingTime)}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div 
                            className="w-20 h-20 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <Image src="/cloud.svg" alt="Upload Icon" width={32} height={32} />
                        </div>
                        <div className="mt-3 text-center">
                            <p>Drag and drop audio file</p>
                            <button 
                                className="text-blue-500 hover:text-blue-400"
                                onClick={() => fileInputRef.current.click()}
                            >
                                Browse files
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="audio/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}