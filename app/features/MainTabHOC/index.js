import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
} from 'react-native';

import Header, {headerHeight} from '../../components/Header';

import {useNavigation} from '@react-navigation/native';
import {useTheme} from '@react-navigation/native';

import PropTypes from 'prop-types';

// import AsyncStorage from '@react-native-community/async-storage';

const MainTabHOC = Component => props => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    //   try {
    //     await AsyncStorage.setItem(aws_access_key_id, "ASIAZZQ4LEBLVS3KQRXP");
    //   } catch(e) {
    //     console.log(e);
    //   }
    //   console.log('user token: ', userToken);
    // const payload = {};
    // props.fetchPredictions(payload);

    const backAction = () => {
      if (Component.name == 'HomeScreen') {
        BackHandler.exitApp();
      } else {
        navigation.goBack();
      }
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
        contentContainerStyle={{
          marginTop: headerHeight,
        }}
        style={{
          flex: 1,
          height: '100%',
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <Component {...props}>{props.children}</Component>
      </ScrollView>
    </SafeAreaView>
  );
};

MainTabHOC.propTypes = {};

MainTabHOC.defaultProps = {};

export default MainTabHOC;
