import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Switch, StyleSheet, StatusBar } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import ThemeToggler from '../ThemeToggler';

function Header({ screenName, navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={{flex:1}} /> */}
            <Icons name={"arrow-back-outline"} size={32} color="#fff" onPress={() => { navigation.goBack() }} />
            <Text>{screenName}</Text>
            <ThemeToggler />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        flexDirection: "row",
        maxHeight: 60,
        marginTop: StatusBar.currentHeight,
        padding: 16,
        backgroundColor: "#8cd9d1",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "absolute",
        top: 0,
    }
});

export default Header;