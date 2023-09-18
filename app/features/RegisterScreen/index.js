import React, { useState, useEffect } from 'react';
import { Button, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { register, setLanguage } from './actions';
import auth from '@react-native-firebase/auth';

function RegisterScreen(props) {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    userId: '',
    password: '',
    country: 'IN',
    language: 'EN',
  });

  const [userErr, setUserErr] = useState({
    firstName: false,
    lastName: false,
    userId: false,
    password: false,
    country: false,
    language: false,
  });

  const phoneRegex = "/^((?!(0))[0-9]{8})$/";
  const nameRegex = "/^[a-zA-Z]+(([',.-][a-zA-Z])?[a-zA-Z]*)*$/";

  return (
    <KeyboardAvoidingView
      behavior='padding'
      enableOnAndroid
      style={{
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
    
      <View
        style={{
          justifyContent: 'center',
          alignSelf: 'flex-end',
          width: '100%',
        }}>
        <Text style={{ color: '#000' }}>First Name/Given Name</Text>
        <TextInput
          placeholder={'Please Enter First Name'}
          style={{
            color: '#000',
            width: '100%',
            borderBottomColor: '#000',
            borderBottomWidth: 1,
          }}
          onChangeText={txt => setUser({ ...user, firstName: txt })}
          defaultValue={user.firstName}
        />
        <Text style={{ color: '#000', marginTop: 10 }}>
          Last Name/Family Name
        </Text>
        <TextInput
          placeholder={'Please Enter Last Name'}
          style={{
            color: '#000',
            width: '100%',
            borderBottomColor: '#000',
            borderBottomWidth: 1,
          }}
          onChangeText={txt => setUser({ ...user, lastName: txt })}
        />
        <Text style={{ color: '#000', marginTop: 10 }}>User Id</Text>
        <TextInput
          placeholder={'Please Enter Username/email'}
          style={{
            color: '#000',
            width: '100%',
            borderBottomColor: '#000',
            borderBottomWidth: 1,
          }}
          onChangeText={txt => setUser({ ...user, userId: txt })}
        />
        <Text style={{ color: '#000', marginTop: 10 }}>Password</Text>
        <TextInput
          placeholder={'Please Enter Password'}
          style={{
            color: '#000',
            width: '100%',
            borderBottomColor: '#000',
            borderBottomWidth: 1,
          }}
          onChangeText={txt => setUser({ ...user, password: txt })}
        />
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{ color: '#000', marginTop: 10, flexWrap: 'wrap' }}>
            Country
          </Text>
          <TextInput
            placeholder={'Select Country'}
            style={{
              color: '#000',
              maxWidth: '100%',
              borderBottomColor: '#000',
              borderBottomWidth: 1,
              flexWrap: 'wrap',
            }}
            onChangeText={txt => setUser({ ...user, country: txt })}
          />
        </View>
        <View>
          <Text style={{ color: '#000', marginTop: 10, flexWrap: 'wrap' }}>
            Language
          </Text>
          <TextInput
            placeholder={'Select Language'}
            style={{
              color: '#000',
              maxWidth: '100%',
              borderBottomColor: '#000',
              borderBottomWidth: 1,
              flexWrap: 'wrap',
            }}
            onChangeText={txt => setUser({ ...user, language: txt })}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          props.register(user);
          auth()
            .createUserWithEmailAndPassword(user.userId, user.password)
            .then(() => {
              console.log('User account created & signed in!');
              props.dispatch({
                type: 'REGISTER_SUCCESS',
                context: 'RegisterScreen',
                payload: user,
              });
            })
            .catch(error => {
              props.dispatch({
                type: 'REGISTER_FAILURE',
                context: 'RegisterScreen',
                payload: error,
              });
              if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
              }

              if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
              }

              //   console.error(error);
            });
        }}
        style={{
          padding: 15,
          alignSelf: 'center',
          marginTop: 30,
          backgroundColor: '#add8e6',
        }}>
        <Text>{'Sign Up'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ margin: 10 }}
        onPress={() => props.navigation.navigate('Login')}>
        <Text style={{ width: "100%", textAlign: "right", alignSelf: "flex-end", color: 'red' }}>{'Existing User! Sign In'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

RegisterScreen.propTypes = {};

RegisterScreen.defaultProps = {};

const mapStateToProps = state => ({
  regObj: state.auth.regObj,
  isRegistered: state.auth.isRegistered,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  register,
  setLanguage,
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
