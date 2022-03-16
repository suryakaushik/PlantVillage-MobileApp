import React, { useState, useEffect, useContext } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Switch,
    StyleSheet,
    StatusBar,
    Button,
} from 'react-native';

import { ThemeContext } from '../../../App';

function ThemeToggler({ screenName, navigation }) {
    const [isEnabled, setIsEnabled] = useState(theme == 'light' ? false : true);
    const { theme, setTheme } = useContext(ThemeContext);
    console.log('kaus theme', theme);
    return (
        <SafeAreaView style={styles.container}>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
                onValueChange={() => {
                    if (theme == "dark") {
                        setTheme("light");
                        setIsEnabled(false)
                    }
                    else {
                        setTheme("dark");
                        setIsEnabled(true)
                    }
                }}
                style={{ flex: 1 }}
            />
            
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {},
});

export default ThemeToggler;
