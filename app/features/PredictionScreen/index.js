import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    Image,
    PermissionsAndroid,
} from 'react-native';

// import AsyncStorage from '@react-native-community/async-storage';

import OpenSettings from "react-native-open-settings";
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-crop-picker';
// import RNFS from 'react-native-fs';
var RNFS = require('react-native-fs');

const PredictionScreen = () => {
    const [img, setImg] = useState("")
    const [output, setOutput] = useState({})
    const [showUploadOptions, setShowUploadOptions] = useState(false)
    const [docSource, setDocSource] = useState("")
    const pickerData = {
        width: 256,
        height: 256,
        compressImageMaxWidth: 256,
        compressImageMaxHeight: 256,
        includeBase64: true,
        useFrontCamera: true,
        // compressImageQuality: 0.8,
    }

    // useEffect(()=>{
    //   try {
    //     await AsyncStorage.setItem(aws_access_key_id, "ASIAZZQ4LEBLVS3KQRXP");
    //   } catch(e) {
    //     console.log(e);
    //   }
    //   console.log('user token: ', userToken);
    // },[])

    const showCamera = () => {
        ImagePicker.openCamera(pickerData).then((image) => {
            setImg(image);
            setDocSource(image.data);
            setShowUploadOptions(false)
        }).catch((error) => {
            setTimeout(() => {
                if (error.code === "E_PERMISSION_MISSING") {
                    OpenSettings.openSettings();
                }
            }, 1000)
        })
    }

    const showPicker = () => {
        ImagePicker.openPicker(pickerData).then((image) => {
            setImg(image);
            setDocSource(image.data);
            console.log("kaus", image, image.data)
            setShowUploadOptions(false)
        }).catch((error) => {
            setTimeout(() => {
                if (error.code === "E_PERMISSION_MISSING") {
                    OpenSettings.openSettings();
                }
            }, 1000)
        })
    }

    const fun = () => {
        return RNFS.readFile(img.path, 'base64').then(res => { return res });
    }

    return (
        <>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                {docSource !== "" &&
                    <Image source={{ uri: `data:image/jpg;base64,${docSource}` }} style={{ width: 300, height: 400 }} />
                }
                <TouchableOpacity onPress={() => { setShowUploadOptions(true) }} style={{ width: 100, height: 100, backgroundColor: "red", alignItems: "center", justifyContent: "center" }}>
                    <Text>{"Upload"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    console.log("kk11", img, docSource);
                    // let data = fun()
                    // console.log(data)
                    fetch('http://127.0.0.1:5000/predict/', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: {
                            file: docSource,
                            BUCKET: "plantvillage-rnapp-pyflask-basic-detect",
                            aws_access_key_id: "ASIAZZQ4LEBLVS3KQRXP",
                            aws_secret_access_key: "k575GnIX1YBNussr9XqsI0OeCfOSq8S7Z7vOZ4dK",
                            aws_session_token: "FwoGZXIvYXdzEM///////////wEaDF5gA14we6SYH+jrhiLJAfPv/MyxsXinxGzG2EWv+Cu8OpaQnB5n3uOz4ZyIxoaKOuG44uFDGM3QdoWy9oBqkd7x1jBTVxeABA+BynLzqTgizkwAeCeIMkzLhKWn11mYykf6Cs+w5TzLCrK4qp4nueBUbYXJtf2jAtRZAxYpjooDQf2j201iUz5MRSX0zsiaCUchTIKp56b866gtgKIplJ+hL3jSgaeON1f83CFsWx85SulMwGPrFSZB5+Ayah7cJ5Lvt7Sa2I/dyC3et/DRW00Z7nex1di3EyiQ4aCLBjItUf5VY10cC56Nsz9SZEvQ7lXKu1q5y5mlF3nG7048+XNbtSb/ZOjMN+SzHwVw",
                        }
                    }).then((response) => response.json())
                        .then((json) => {
                            setOutput(json)
                        })
                        .catch((error) => {
                            console.log(JSON.stringify(error), error);
                        });
                }}
                    style={{ marginTop: 20, width: 100, height: 100, backgroundColor: "green", alignItems: "center", justifyContent: "center" }}>
                    <Text>{"Predict"}</Text>
                </TouchableOpacity>
                {output &&
                    <>
                        <Text>{"Disease is: "}</Text>
                        <Text>{JSON.stringify(output)}</Text>
                    </>
                }
            </View>

            <Modal isVisible={showUploadOptions} style={{ margin: 0, padding: 0, justifyContent: "flex-end" }}>
                <View style={{ width: "100%" }}>
                    <Text style={styles.modalOptionsText} onPress={() => { showCamera() }}>{"Camera"}</Text>
                    <View style={styles.divider} />
                    <Text style={[styles.modalOptionsText, { marginBottom: 5 }]} onPress={() => { showPicker() }}>{"Library"}</Text>
                    <Text style={styles.modalOptionsText} onPress={() => { setShowUploadOptions(false) }}>{"Cancel"}</Text>
                </View>
            </Modal>
        </>
    );

};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    divider: {
        borderWidth: 1,
        borderColor: "#cccccc",
        paddingHorizontal: 25
    },
    modalOptionsText: {
        paddingVertical: 25,
        backgroundColor: "#fff",
        fontFamily: "Avenir",
        lineHeight: 16,
        textAlign: "center",
        fontSize: 14,
        color: "#3b3b3b"
    }
});

export default PredictionScreen;