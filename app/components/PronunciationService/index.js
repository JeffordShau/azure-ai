'use client';

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const SPEECH_KEY = process.env.NEXT_PUBLIC_SPEECH_KEY;
const SPEECH_REGION = process.env.NEXT_PUBLIC_SPEECH_REGION;

export const PronunciationService = async (audioBlob, referenceText, languageCode) => {
    try {
        // create speech configuration
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
        speechConfig.speechRecognitionLanguage = languageCode;

        // create pronunciation assessment configuration
        const pronunciationConfig = new SpeechSDK.PronunciationAssessmentConfig(
            referenceText,
            SpeechSDK.PronunciationAssessmentConfig.PronunciationAssessmentGradingSystem.FullyDetailed,
            SpeechSDK.PronunciationAssessmentConfig.PronunciationAssessmentGranularity.Phoneme, true,
        );

        
    }
}