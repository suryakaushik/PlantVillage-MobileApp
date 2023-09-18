import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Button, Text, BackHandler, TextInput, Animated, Pressable, useWindowDimensions } from 'react-native';

import MainTabHOC from '../../features/MainTabHOC/index';

import { useTheme } from '@react-navigation/native';

function PageTracking(props) {
    const { colors } = useTheme();

    const { width } = useWindowDimensions();
    const [btnDisable, setBtnDisable] = React.useState(true);
    const AnimatedProgressValue = new Animated.Value(0)
    const fadeAnim = useRef(new Animated.Value(0.2)).current;

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


    const isCloseToBottom = ({ layoutMeasurement, contentSize, contentOffset }) => {
        return layoutMeasurement.height + contentOffset.y >= contentSize - PAD;
    };

    useEffect(() => {
        if (!btnDisable) {
            Animated.timing(fadeAnim, {
                toValue: 1, duration: 600, useNativeDriver: true
            }).start();
        }
    }, [btnDisable]);

    return (
        <View
            style={{
                // flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
            <Text style={{ color: "#000" }}>Page Tracking</Text>

            <ScrollView scrollEventThrottle={16} onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentSize, contentOffset } = nativeEvent;
                AnimatedProgressValue.setValue((layoutMeasurement.height + contentOffset.y) / (contentSize.height));
                if (isCloseToBottom(nativeEvent)) {
                    if (btnDisable) setBtnDisable(false);
                }
            }}>
                <Text style={{ color: "#000" }}>
                    {"gbf"}
                </Text>
                <AnimatedPressable style={{ opacity: fadeAnim, height: 3, backgroundColor: 'orange', margin: 16, borderRadius: 16 }} onPress={() => alert('I AGREE')} disabled={btnDisable}>
                    <Text>I AGREE</Text>
                </AnimatedPressable>
            </ScrollView>

            {/* Progress Bar */}
            <Animated.View
                style={{
                    height: 5,
                    width,
                    backgroundColor: "green",
                    transform: [{
                        translateX: -width
                    },
                    {
                        scaleX: AnimatedProgressValue
                    },
                    {
                        translateX: width
                    }]
                }}
            >

            </Animated.View>
        </View>
    );
}

export default PageTracking;
