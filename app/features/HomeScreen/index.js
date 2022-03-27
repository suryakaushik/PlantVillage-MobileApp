import React, { useState, useEffect } from 'react';
import { View, ScrollView, SafeAreaView, Text, BackHandler } from 'react-native';

import Header, { headerHeight } from '../../components/Header';

import { useTheme } from '@react-navigation/native';

function HomeScreen(props) {
    const { colors } = useTheme();

    useEffect(() => {
        const backAction = () => {
            // navigation.goBack();
            BackHandler.exitApp();
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () =>
            BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, []);

    return (
        <SafeAreaView>
            <Header />
            <ScrollView
                style={{
                    marginTop: headerHeight,
                    backgroundColor: colors.background,
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Text style={{ color: colors.text }}>Home Screen</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeScreen;

// import React, {useState, useEffect} from 'react';
// import {View, ScrollView, Button, Text, BackHandler} from 'react-native';

// import MainTabHOC from '../MainTabHOC';

// import {useTheme} from '@react-navigation/native';

// function HomeScreen(props) {
//   const {colors} = useTheme();

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}>
//       <Text style={{color: colors.text}}>Home Screen</Text>
//     </View>
//   );
// }

// export default MainTabHOC(HomeScreen);
