import * as React from 'react';
import { Animated, View, Button, Text } from 'react-native';

function SplashScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(1)).current

    React.useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 2000,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 2000,
                }),
            ])).start();
    }, [fadeAnim])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(140,217,209,255)"    }}>
            <Animated.Image source={require("../../../assets/images/logo_color.png")}
                style={{
                    width: "100%", maxHeight: "50%", marginHorizontal: 50,
                    opacity: fadeAnim
                }}
                resizeMode={"cover"}
            />
        </View>
    );
}

export default SplashScreen;