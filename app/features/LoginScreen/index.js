import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  Button,
  View,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Modal,
  Alert,
  Platform,
} from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CheckBox from '@react-native-community/checkbox';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  login,
  loginSuccess,
  loginFailure,
  setLanguage,
  setLanguageSuccess,
  setLanguageFailure,
} from './actions';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Picker } from '@react-native-picker/picker';

// import ShowPasswordSvg from "./showPassword.svg";

function LoginScreen(props) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState({
    userId: '',
    password: '',
  });

  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isCheckboxSelected, setCheckboxSelected] = useState(false);

  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  const [loginErr, setLoginErr] = useState('');

  const [isUserPersisted, setIsUserPersisted] = useState(false);
  const userIdRegex = new RegExp(
    /^([a-zA-Z0-9_\.\-])+\@+(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  );
  // const passwordRegex = "/^([a-zA-Z0-9_\.\-])+\@+(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/";

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Handle user state changes
  const onAuthStateChanged = user => {
    setUser(user);
    console.log('kaus onAuthStateChanged', user);

    // TODO: write async-storage logic-->Remenber ME
    if (isCheckboxSelected) {
      async function setLoginDetails() {
        try {
          await AsyncStorage.setItem('userId', user.userId);
          await AsyncStorage.setItem('password', user.password);
        } catch (e) {
          console.log(e);
        }
      }
      setLoginDetails();
    }

    if (initializing) setInitializing(false);
    if (user) {
      props.navigation.navigate('MainTab');
    }
  };

  const onLogin = () => {
    props.login({ ...user, role: 'user' });
    auth()
      .signInWithEmailAndPassword(userID, password)
      .then(() => {
        props.loginSuccess({
          userId: userID,
          password: password,
          role: 'user',
        });
      })
      .catch(error => {
        props.loginFailure(error);
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        if (error.code === 'auth/wrong-password') {
          console.log('That password is Wrong!');
        }
        // console.error(error);
      });
  };

  const onAnonymousLogin = () => {
    props.login({ ...user, role: 'guest' });
    auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously');
        props.loginSuccess({ ...user, role: 'guest' });
        props.navigation.navigate('MainTab', {
          screen: 'PredictionScreen',
        });
      })
      .catch(error => {
        props.loginFailure(error);
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }
        console.error(error);
      });
  };

  const onLanguageChange = (itemValue, itemIndex) => {
    setSelectedLanguage(itemValue);
    props.setLanguageSuccess(itemValue);
  };

  useLayoutEffect(() => {
    let initUserId = '';
    let initPassword = '';

    // TODO: use redux-persist
    async function fetchLoginDetails() {
      try {
        initUserId = await AsyncStorage.getItem('userId');
        initPassword = await AsyncStorage.getItem('password');
        setIsUserPersisted(true);
      } catch (e) {
        console.log(e);
      }
    }
    fetchLoginDetails();
    setUser({
      userId: initUserId,
      password: initPassword,
    });
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  // TODO: Use Valid Regex
  const isValidUserId = (txt, regex = userIdRegex) => {
    return regex.test(txt);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="padding"
        enableOnAndroid
        contentContainerStyle={{
          flex: 1,
          // width: '100%',
          justifyContent: 'space-between',
          alignContent: 'space-between',
          // alignItems: 'flex-end'
        }}
        accessible
        accessibilityLabel="container"
        testID="container">

        {/* <Text style={{ textAlign: 'center' }}>
                        {userID && isUserPersisted ? `Welcome back, ${userID}` : 'Welcome'}
                    </Text> */}
        <View>
          <View
            style={{
              // flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
            <Picker
              style={styles.pickerStyle}
              selectedValue={selectedLanguage}
              onValueChange={onLanguageChange}
              mode={'dialog'}>
              <Picker.Item label="ENGLISH" value="EN" />
              <Picker.Item label="TELUGU" value="TE" />
              <Picker.Item label="HINDI" value="IN" />
            </Picker>

            {/* TODO: Fix LoginAsGuest */}
            <TouchableOpacity
              style={{
                height: 50,
                borderRadius: 32,
                paddingHorizontal: 20,
                backgroundColor: '#add8e6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={onAnonymousLogin}>
              <Text>{'Login as a Guest'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}></View>
          <Image
            source={require('../../../assets/images/logo_color.png')}
            style={styles.logoImg}
            resizeMode={'cover'}
          />
          {/* <Text style={{color: '#000'}}>User Id</Text> */}
          <TextInput
            autoCorrect={false}
            maxLength={100}
            testID="userId"
            placeholder={'Please Enter Username/email'}
            placeholderTextColor={"#000"}
            style={[
              styles.userIdTxt,
              {
                borderBottomColor: loginErr ? 'red' : '#000',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
              },
            ]}
            onChangeText={txt => {
              setUserID(txt);
              if (!isValidUserId(txt)) {
                setLoginErr(true);
              } else if (loginErr) {
                setLoginErr(false);
              }
            }}
          />
          {/* <Text style={{color: '#000', marginTop: 20}}>Password</Text> */}
          <TextInput
            // autoCorrect={false}
            maxLength={100}
            testID="password"
            secureTextEntry={true}
            placeholder={'Please Enter Password'}
            placeholderTextColor={"#000"}
            style={[
              styles.passwordTxt,
              {
                borderBottomColor: loginErr ? 'red' : '#000',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
              },
            ]}
            onChangeText={txt => {
              setPassword(txt);
              if (!txt) {
                setLoginErr(true);
              } else if (loginErr) {
                setLoginErr(false);
              }
            }}></TextInput>
          {/* <TouchableOpacity
                            style={{
                                alignSelf: 'flex-end',
                                width: 17,
                                height: 17,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <ShowPasswordSvg />
                        </TouchableOpacity> */}
          {loginErr ? (
            <Text style={{ color: 'red', padding: 4 }}>
              {'Enter Valid User Id / Password'}
            </Text>
          ) : null}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={isCheckboxSelected}
              onValueChange={setCheckboxSelected}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Remember ME</Text>
          </View>
          <TouchableOpacity
            disabled={loginErr}
            onPress={onLogin}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              alignSelf: 'center',
              marginVertical: 8,
              backgroundColor: '#add8e6',
              borderRadius: 25,
            }}>
            <Text style={{ color: '#000' }}>{'Login'}</Text>
          </TouchableOpacity>

          <View
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              marginTop: 9,
            }}>
            <Text style={{ color: '#000' }}>{'Register as a new User? '}</Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Register')}>
              <Text style={{ color: 'red' }}>{'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{ alignSelf: 'flex-end', color: 'red', marginVertical: 5 }}
            onPress={() => {
              setShowEmailVerifyModal(true);
            }}>
            {'Forgot your Password?'}
          </Text>
        </View>
      </KeyboardAvoidingView>
      <Modal
        //  animationType="slide"
        visible={showEmailVerifyModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setShowEmailVerifyModal(false);
        }}
        style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            marginHorizontal: 30,
            borderRadius: 20,
            padding: 18,
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}>
          <Text style={{ color: '#000' }}>Email</Text>
          <TextInput
            autoComplete="email"
            placeholder={'Please Enter your Email'}
            autoFocus
            style={{
              color: '#000',
              width: '100%',
              borderBottomColor: '#000',
              borderBottomWidth: 1,
            }}
            onChangeText={txt => setUserID(txt)}
          />
          <TouchableOpacity
            onPress={() => {
              auth()
                .sendPasswordResetEmail(userID, {
                  handleCodeInApp: true,
                  url: 'http://www.kaushikpd.com/',
                })
                .then(() => {
                  setShowEmailVerifyModal(false);
                  Alert.alert('An email with verification code is sent!');
                  setShowResetModal(true);
                })
                .catch(error => {
                  console.error(error);
                });
              setShowEmailVerifyModal(false);
            }}
            style={{
              padding: 15,
              alignSelf: 'center',
              marginVertical: 10,
              backgroundColor: '#add8e6',
            }}>
            <Text>{'Send'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        //  animationType="slide"
        visible={showResetModal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setShowResetModal(false);
        }}
        style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            marginHorizontal: 30,
            borderRadius: 20,
            padding: 18,
            backgroundColor: 'rgba(255,255,255,0.7)',
          }}>
          <Text style={{ color: '#000' }}>New Password</Text>
          <TextInput
            placeholder={'Enter New Password'}
            style={{
              color: '#000',
              width: '100%',
              borderBottomColor: '#000',
              borderBottomWidth: 1,
            }}
            onChangeText={txt => setNewPassword(txt)}
          />
          <Text style={{ color: '#000' }}>Code</Text>
          <TextInput
            placeholder={'Enter Verification Code'}
            style={{
              color: '#000',
              width: '100%',
              borderBottomColor: '#000',
              borderBottomWidth: 1,
            }}
            onChangeText={txt => setCode(txt)}
          />
          <TouchableOpacity
            onPress={() => {
              auth()
                .confirmPasswordReset(code, newPassword)
                .then(() => {
                  setShowEmailVerifyModal(false);
                  setShowResetModal(false);
                  Alert.alert('Pasword Reset successful!');
                })
                .catch(error => {
                  console.error(error);
                });
              setShowResetModal(false);
            }}
            style={{
              padding: 15,
              alignSelf: 'center',
              marginVertical: 10,
              backgroundColor: '#add8e6',
            }}>
            <Text>{'Reset Password'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    elevation: 6,
  },
  pickerStyle: {
    height: 50,
    width: 150,
    color: '#000',
    borderColor: '#2c2c2c',
    borderRadius: 20,
  },
  logoImg: {
    width: '100%',
    maxHeight: '30%',
    alignSelf: 'center',
    marginHorizontal: 60,
  },
  userIdTxt: {
    color: '#000',
    width: '100%',
    borderBottomWidth: 1,
  },
  passwordTxt: {
    color: '#000',
    width: '100%',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    marginTop: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 3,
    alignSelf: 'center',
  },
});

LoginScreen.propTypes = {};

LoginScreen.defaultProps = {};

const mapStateToProps = state => ({
  loginObj: state.auth.loginObj,
  isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
  login: payload => {
    console.log('dispatching now');
    dispatch(login(payload));
  },
  loginSuccess: payload => {
    console.log('dispatching now');
    dispatch(loginSuccess(payload));
  },
  loginFailure: payload => {
    console.log('dispatching now');
    dispatch(loginFailure(payload));
  },
  setLanguage: payload => {
    console.log('dispatching now');
    dispatch(setLanguage(payload));
  },
  setLanguageSuccess: payload => {
    console.log('dispatching now');
    dispatch(setLanguageSuccess(payload));
  },
  setLanguageFailure: payload => {
    console.log('dispatching now');
    dispatch(setLanguageFailure(payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
