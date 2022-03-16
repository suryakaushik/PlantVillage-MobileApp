import React, { useState, useEffect, useRef } from 'react';
import { Button, View, SafeAreaView, Text, TouchableOpacity, TextInput, Image, StatusBar, Modal, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

import { Picker } from '@react-native-picker/picker';

function LoginScreen({ navigation }) {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState({});
    const [selectedLanguage, setSelectedLanguage] = useState("ENGLISH");

    // const pickerRef = useRef();
    // function open() {
    //     pickerRef.current.focus();
    // }
    // function close() {
    //     pickerRef.current.blur();
    // }

    const [userID, setUserID] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    // Handle user state changes
    const onAuthStateChanged = (user) => {
        setUser(user);
        console.log("kaus", user)
        if (initializing) setInitializing(false);
    }

    const onLogin = () => {
        auth().signInWithEmailAndPassword(userID, password).then(() => {
            console.log('User signed in!');
        })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                }
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }
                if (error.code === 'auth/wrong-password') {
                    console.log('That password is Wrong!');
                }
                console.error(error);
            });
    }

    useEffect(() => {
        // open();
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

    if (user) {
        navigation.navigate('MainTab');
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: "#fff", elevation: 6 }}>
            <StatusBar
                backgroundColor={"#8cd9d1"}
                barStyle={'light-content'}
                translucent={false} />
            <View style={{ flexDirection: "row" }}>
                <Text style={{ textAlign: "left", color: "red", alignSelf: "flex-start" }}>{"Choose Your Language"}</Text>
                <Picker
                    // ref={pickerRef}
                    style={{backgroundColor:"#000"}}
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }>
                    <Picker.Item label="ENGLISH" value="EN" />
                    <Picker.Item label="TELUGU" value="TE" />
                    <Picker.Item label="THAILAND" value="TH" />
                </Picker>
            </View>
            <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'flex-end', width: "100%" }}>
                <Text style={{ textAlign: "center" }}>{user ? `Welcome back, ${user}` : "Welcome"}</Text>

                <Image source={require("../../../assets/images/logo_color.png")} style={{ width: "100%", maxHeight: "30%", alignSelf: "center", marginHorizontal: 60 }} resizeMode={"cover"} />
                <Text style={{ color: "#000" }}>User Id</Text>
                <TextInput
                    placeholder={"Please Enter Username/email"}
                    style={{ color: "#000", width: "100%", borderBottomColor: "#000", borderBottomWidth: 1 }}
                    onChangeText={(txt) => setUserID(txt)}
                />
                <Text style={{ color: "#000", marginTop: 10 }}>Password</Text>
                <TextInput
                    placeholder={"Please Enter Password"}
                    style={{ color: "#000", width: "100%", borderBottomColor: "#000", borderBottomWidth: 1 }}
                    onChangeText={(txt) => setPassword(txt)}
                />
                <Text
                    style={{ color: "red", marginVertical: 10 }}
                    onPress={() => {
                        setShowEmailVerifyModal(true);
                    }}>{"Forgot your Password?"}</Text>
                <TouchableOpacity
                    onPress={onLogin}
                    style={{ padding: 15, alignSelf: 'center', marginVertical: 10, backgroundColor: "#add8e6" }}
                >
                    <Text>{"Login"}</Text>
                </TouchableOpacity>

                <View style={{ alignSelf: "flex-start", flexDirection: "row", marginTop: 9 }}>
                    <Text style={{ color: "#000" }}>{"Register as a new User? "}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{ color: "red" }}>{"Sign Up"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <Button
                title="Login as a Guest"
                onPress={() => {
                    auth()
                        .signInAnonymously()
                        .then(() => {
                            console.log('User signed in anonymously');
                        })
                        .catch(error => {
                            if (error.code === 'auth/operation-not-allowed') {
                                console.log('Enable anonymous in your firebase console.');
                            }

                            console.error(error);
                        });
                    navigation.navigate('MainTab')
                }}
            /> */}

            <Modal
                //  animationType="slide"
                visible={showEmailVerifyModal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setShowEmailVerifyModal(false);
                }}
                style={{ backgroundColor: "rgba(0,0,0,0.7)", margin: 0, alignItems: "center", justifyContent: "center" }}
            >
                <View style={{ marginHorizontal: 30, borderRadius: 20, padding: 18, backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <Text style={{ color: "#000" }}>Email</Text>
                    <TextInput
                        placeholder={"Please Enter your Email"}
                        style={{ color: "#000", width: "100%", borderBottomColor: "#000", borderBottomWidth: 1 }}
                        onChangeText={(txt) => setUserID(txt)}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            auth().sendPasswordResetEmail(userID, {
                                handleCodeInApp: true,
                                url: "http://www.kaushikpd.com/"
                            }).then(() => {
                                setShowEmailVerifyModal(false);
                                Alert.alert("An email with verification code is sent!");
                                setShowResetModal(true);
                            }).catch(error => {
                                console.error(error);
                            })
                            setShowEmailVerifyModal(false);
                        }}
                        style={{ padding: 15, alignSelf: 'center', marginVertical: 10, backgroundColor: "#add8e6" }}
                    >
                        <Text>{"Send"}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                //  animationType="slide"
                visible={showResetModal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setShowResetModal(false);
                }}
                style={{ backgroundColor: "rgba(0,0,0,0.7)", margin: 0, alignItems: "center", justifyContent: "center" }}
            >
                <View style={{ marginHorizontal: 30, borderRadius: 20, padding: 18, backgroundColor: "rgba(255,255,255,0.7)" }}>
                    <Text style={{ color: "#000" }}>New Password</Text>
                    <TextInput
                        placeholder={"Enter New Password"}
                        style={{ color: "#000", width: "100%", borderBottomColor: "#000", borderBottomWidth: 1 }}
                        onChangeText={(txt) => setNewPassword(txt)}
                    />
                    <Text style={{ color: "#000" }}>Code</Text>
                    <TextInput
                        placeholder={"Enter Verification Code"}
                        style={{ color: "#000", width: "100%", borderBottomColor: "#000", borderBottomWidth: 1 }}
                        onChangeText={(txt) => setCode(txt)}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            auth()
                                .confirmPasswordReset(code, newPassword)
                                .then(() => {
                                    setShowEmailVerifyModal(false)
                                    setShowResetModal(false);
                                    Alert.alert("Pasword Reset successful!");
                                }).catch(error => {
                                    console.error(error);
                                })
                            setShowResetModal(false);
                        }}
                        style={{ padding: 15, alignSelf: 'center', marginVertical: 10, backgroundColor: "#add8e6" }}
                    >
                        <Text>{"Reset Password"}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default LoginScreen;