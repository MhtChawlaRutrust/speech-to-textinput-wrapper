import { NativeModules, NativeEventEmitter, PermissionsAndroid, Platform } from "react-native";

export const requestMicPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: 'Microphone Permission',
                message: 'This app needs access to your microphone for speech recognition.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};


const { SpeechToText } = NativeModules;

const emitter = new NativeEventEmitter(SpeechToText);

export const startListening = (language?: string) => {
    SpeechToText.startListening(language ?? "en-US");
};

export const stopListening = () => {
    SpeechToText.stopListening();
};

export const onSpeechResults = (callback: (text: string) => void) => {
    return emitter.addListener('onSpeechResults', callback);
};

export const onSpeechError = (callback: (error: string) => void) => {
    return emitter.addListener('onSpeechError', callback);
};
