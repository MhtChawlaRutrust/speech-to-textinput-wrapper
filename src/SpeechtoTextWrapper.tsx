import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
    startListening,
    stopListening,
    onSpeechResults,
    onSpeechError,
    requestMicPermission,
} from './SpeechToText';

export const SpeechToTextWrapper = (p: {
    children: React.ReactElement
    locale?: string
}) => {
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const resultSub = onSpeechResults(text => {
            console.log('Transcribed Text:', text);
            const childProps = (p.children as any)?.props;

            if (typeof childProps?.onChangeText === 'function') {
                childProps.onChangeText(text);
            } else {
                console.warn("onChangeText is not defined on child component");
            }

            setIsListening(false);
        });

        const errorSub = onSpeechError(err => {
            console.error('Speech Error:', err);
        });

        return () => {
            resultSub.remove();
            errorSub.remove();
        };
    }, []);

    const micHandler = async () => {
        const hasPermission = await requestMicPermission();
        if (!hasPermission) {
            console.warn("Microphone permission denied");
            return;
        }

        if (isListening) {
            setIsListening(false);
            stopListening();
        } else {
            setIsListening(true);
            startListening(p.locale);
        }
    };


    return (
        <>
            <View style={{ justifyContent: "center" }}>
                {p.children}

                <TouchableOpacity
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingVertical: 10,
                        position: "absolute",
                        right: 10,
                    }}
                    onPress={micHandler}
                >
                    <Text>{isListening ? "STOP" : "START"}</Text>
                    {/* <Image
                        source={isListening ? wavesIcon : micIcon}
                        style={{
                            width: 24,
                            height: 24,
                        }}
                        key={isListening.toString()}
                        resizeMode="contain"
                    /> */}
                </TouchableOpacity>
            </View>
        </>
    );
};
