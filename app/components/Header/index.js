import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Button,
  Switch,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import auth from '@react-native-firebase/auth';

import ThemeToggler from '../ThemeToggler';
import { useTheme } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { logout, logoutSuccess, logoutFailure } from './actions';

function Header(props) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        dispatch(logoutSuccess());
        navigation.navigate('Login');
      })
      .catch(error => {
        if (error.code == 'auth/no-current-user') {
          console.log('No User is logged in! Already signed out!');
          dispatch(logoutSuccess());
          navigation.navigate('Login');
          return true;
        }
        dispatch(logoutFailure());
        console.log('User sign-out error', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* <View style={{flex:1}} /> */}
      <Button title="Logout" onPress={onLogout} />
      <Text style={{ color: colors.text }}>{props.screenName}</Text>
      <ThemeToggler />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    maxHeight: 60,
    padding: 16,
    backgroundColor: '#8cd9d1',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 0,
    zIndex: 50,
  },
});

export const headerHeight = 60;
export default Header;
