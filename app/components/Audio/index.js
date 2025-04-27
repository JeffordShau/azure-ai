'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';


export default function Media({ script }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [timeProgress, setTimeProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);
    const recordingChunksRef = useRef([]);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);
    const progressRef = useRef(null);

    // useEffect(() => {
    //     const audio = audioRef.current;
    //     if (!audio) return;
    
    //     const setAudioDuration = () => {
    //     if (!isNaN(audio.duration) && audio.duration !== Infinity) {
    //         setDuration(audio.duration);
    //     } else {
    //         setDuration(0);
    //     }
    //     };
    
    //     audio.addEventListener('loadedmetadata', setAudioDuration);
    
    //     return () => {
    //     audio.removeEventListener('loadedmetadata', setAudioDuration);
    //     };
    // }, []);

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

    // play/pause audio
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    }, [isPlaying]);

    // start recording
    const startRecording= async () => {
        try {
            // setRecordingTime(0);
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
            }

            mediaRecorderRef.current.start(1000);
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
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => {
                track.stop();
                track.enable = false;
            });
            setIsRecording(false);
        }
        if (timerRef.current) clearInterval(timerRef.current);
    };

    // upload audio
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            setAudioBlob(file);
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

    // submit audio for assessment
    const handleSubmit = async () => {
        if (!audioBlob) return;
        
        setLoading(true);

        try {
            const result = await sendAudioForAssessment(audioBlob, script);
            setResults(assessmentResults);
        }
        catch (error) {
            console.error('Error during assessment:', error);
        }
        finally {
            setLoading(false);
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
            {audioBlob && !isRecording && (
                <>
                    <div className="bg-gray-900 border border-gray-700 rounded-lg mt-5 px-2 py-2">
                        <audio
                            ref={audioRef}
                            src={audioBlob ? URL.createObjectURL(audioBlob) : undefined}
                            preload="metadata"
                            onLoadedMetadata = {() => {
                                const audio = audioRef.current;
                                if (audio && !isNaN(audio.duration)) {
                                    setDuration(audio.duration);
                                }
                            }}
                            onTimeUpdate = { () => {
                                const audio = audioRef.current;
                                if (audio) {
                                    setTimeProgress(audio.currentTime);
                                }
                            }}
                            // onPlay={() => setIsPlaying(true)}
                            // onPause={() => setIsPlaying(false)}
                            // onEnded={() => setIsPlaying(false)}
                            controls
                        />
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsPlaying((isPlaying) => !isPlaying)}>
                                {isPlaying ? (
                                    <Image src="/pause.svg" alt="Pause Icon" width={32} height={32} />
                                ) : (
                                    // Play icon
                                    <Image src="/play.svg" alt="Play Icon" width={32} height={32} />
                                )}
                            </button>
                            {/* <span>{formatTime(timeProgress)}</span> */}
                            {/* <input
                                type="range"
                                ref={progressRef}
                                value={timeProgress}
                                min={0}
                                max={duration}
                                step="0.01"
                                onChange={handleProgressChange}
                            /> */}
                            {/* <span>{formatTime(timeProgress)} / {formatTime(duration)}</span> */}
                        </div>
                    </div>
                </>
            )}
            <p>{duration}</p>
            {results && (
                <div className="mt-6 w-full p-4 bg-gray-800 rounded-md">
                <h3 className="text-lg font-medium mb-2">Assessment Results</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-gray-700 rounded">
                    <p>Accuracy Score: {results.accuracyScore}</p>
                    </div>
                    <div className="p-2 bg-gray-700 rounded">
                    <p>Fluency Score: {results.fluencyScore}</p>
                    </div>
                    <div className="p-2 bg-gray-700 rounded">
                    <p>Completeness: {results.completenessScore}</p>
                    </div>
                    <div className="p-2 bg-gray-700 rounded">
                    <p>Pronunciation: {results.pronunciationScore}</p>
                    </div>
                </div>
                </div>
            )}
        </>
    )
}