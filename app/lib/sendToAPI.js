import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

export const sendToAPI = async (audioBlob, referenceText, languageCode = 'en-US') => {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioData = new Uint8Array(arrayBuffer);

    // Azure Speech Service Configuration
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
        process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
        process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
    );

    // Create audio stream from blob
    const pushStream = SpeechSDK.AudioInputStream.createPushStream();
    pushStream.write(audioData);
    pushStream.close();
    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);

    // Configure pronunciation assessment
    const pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig(
        referenceText,
        SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
        SpeechSDK.PronunciationAssessmentGranularity.Word,
        true
    );

    // Create recognizer
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    pronunciationAssessmentConfig.applyTo(recognizer);

    return new Promise((resolve, reject) => {
        recognizer.recognizeOnceAsync(result => {
        recognizer.close();
        
        if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
            const pronunciationResult = SpeechSDK.PronunciationAssessmentResult.fromResult(result);
            resolve({
            accuracyScore: pronunciationResult.accuracyScore,
            pronunciationScore: pronunciationResult.pronunciationScore,
            fluencyScore: pronunciationResult.fluencyScore,
            completenessScore: pronunciationResult.completenessScore,
            words: pronunciationResult.detailResult.Words
            });
        } else {
            reject(new Error(`Error recognizing speech: ${result.errorDetails}`));
        }
        }, error => {
        recognizer.close();
        reject(error);
        });
    });
};
