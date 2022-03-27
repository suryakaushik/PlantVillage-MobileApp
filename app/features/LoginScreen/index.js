import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
    Button,
    View,
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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

import { Picker } from '@react-native-picker/picker';

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
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    // Handle user state changes
    const onAuthStateChanged = user => {
        setUser(user);
        console.log('kaus onAuthStateChanged', user);

        // TODO: write async-storage logic-->Stay SignedIN
        if (isCheckboxSelected) {
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
        // TODO: if login details are in async storage-->Set the default login details
    }, []);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAwareScrollView
                contentContainerStyle={{ flex: 1, width: '100%' }}
                style={{ width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Picker
                        style={styles.pickerStyle}
                        selectedValue={selectedLanguage}
                        onValueChange={onLanguageChange}
                        mode={'dialog'}>
                        <Picker.Item label="ENGLISH" value="EN" />
                        <Picker.Item label="TELUGU" value="TE" />
                        <Picker.Item label="HINDI" value="IN" />
                    </Picker>
                    <Button title="Login as a Guest" onPress={onAnonymousLogin} />
                </View>
                <View style={styles.contentCont}>
                    <Text style={{ textAlign: 'center' }}>
                        {user ? `Welcome back, ${user}` : 'Welcome'}
                    </Text>

                    <Image
                        source={require('../../../assets/images/logo_color.png')}
                        style={styles.logoImg}
                        resizeMode={'cover'}
                    />
                    {/* <Text style={{color: '#000'}}>User Id</Text> */}
                    <TextInput
                        placeholder={'Please Enter Username/email'}
                        style={styles.userIdTxt}
                        onChangeText={txt => setUserID(txt)}
                    />
                    {/* <Text style={{color: '#000', marginTop: 20}}>Password</Text> */}
                    <TextInput
                        placeholder={'Please Enter Password'}
                        style={styles.passwordTxt}
                        onChangeText={txt => setPassword(txt)}
                    />
                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            value={isCheckboxSelected}
                            onValueChange={setCheckboxSelected}
                            style={styles.checkbox}
                        />
                        <Text style={styles.label}>Stay Signed In!</Text>
                    </View>
                    <TouchableOpacity
                        onPress={onLogin}
                        style={{
                            padding: 15,
                            alignSelf: 'center',
                            marginVertical: 10,
                            backgroundColor: '#add8e6',
                        }}>
                        <Text>{'Login'}</Text>
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
            </KeyboardAwareScrollView>
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
                        placeholder={'Please Enter your Email'}
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
        padding: 30,
        backgroundColor: '#fff',
        elevation: 6,
    },
    pickerStyle: {
        height: 50,
        width: 200,
        color: '#000',
        borderColor: '#000',
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    contentCont: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'flex-end',
        width: '100%',
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
        borderBottomColor: '#000',
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
        margin: 8,
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
