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
  Linking,
} from 'react-native';

import Header, { headerHeight } from '../../components/Header';

import { useTheme } from '@react-navigation/native';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPredictions, getPredictions } from './actions';

// import AsyncStorage from '@react-native-community/async-storage';

import OpenSettings from 'react-native-open-settings';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
// import RNFS from 'react-native-fs';
var RNFS = require('react-native-fs');

const PredictionScreen = props => {
  const { colors } = useTheme();

  const [img, setImg] = useState('');
  const [output, setOutput] = useState({});
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [docSource, setDocSource] = useState('');
  const pickerData = {
    width: 256,
    height: 256,
    compressImageMaxWidth: 256,
    compressImageMaxHeight: 256,
    includeBase64: true,
    useFrontCamera: true,
    // compressImageQuality: 0.8,
  };

  useEffect(() => {
    //   try {
    //     await AsyncStorage.setItem(aws_access_key_id, "ASIAZZQ4LEBLVS3KQRXP");
    //   } catch(e) {
    //     console.log(e);
    //   }
    //   console.log('user token: ', userToken);
    // const payload = {};
  }, []);

  const showCamera = () => {
    ImagePicker.openCamera(pickerData)
      .then(image => {
        setImg(image);
        setDocSource(image.data);
        setShowUploadOptions(false);
      })
      .catch(error => {
        setTimeout(() => {
          if (error.code === 'E_PERMISSION_MISSING') {
            OpenSettings.openSettings();
          }
        }, 1000);
      });
  };

  const showPicker = () => {
    ImagePicker.openPicker(pickerData)
      .then(image => {
        setImg(image);
        setDocSource(image.data);
        console.log('kaus', image, image.data);
        setShowUploadOptions(false);
      })
      .catch(error => {
        setTimeout(() => {
          if (error.code === 'E_PERMISSION_MISSING') {
            OpenSettings.openSettings();
          }
        }, 1000);
      });
  };

  const fun = () => {
    return RNFS.readFile(img.path, 'base64').then(res => {
      return res;
    });
  };

  return (
    <>
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
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 20,
          }}>
          {docSource !== '' && (
            <Image
              source={{ uri: `data:image/jpg;base64,${docSource}` }}
              style={{ width: 300, height: 400 }}
            />
          )}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowUploadOptions(true);
              }}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                margin: 5,
                borderRadius: 20,
                backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: colors.text }}>{'Upload'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('kk11', img, docSource);
                props.getPredictions({ docSource });
              }}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                margin: 5,
                borderRadius: 20,
                backgroundColor: 'green',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: colors.text }}>{'Predict'}</Text>
            </TouchableOpacity>
          </View>
          {output && (
            <View style={{ flex: 1, flexDirection: 'row', marginTop: 20 }}>
              <Text style={{ color: colors.text }}>
                {'Predicted Disease is: '}
              </Text>
              <Text style={{ color: colors.text }}>{JSON.stringify(output)}</Text>
            </View>
          )}
        </View>

        <Modal
          isVisible={showUploadOptions}
          style={{ margin: 0, padding: 0, justifyContent: 'flex-end' }}>
          <View style={{ width: '100%' }}>
            <Text
              style={styles.modalOptionsText}
              onPress={() => {
                showCamera();
              }}>
              {'Camera'}
            </Text>
            <View style={styles.divider} />
            <Text
              style={[styles.modalOptionsText, { marginBottom: 5 }]}
              onPress={() => {
                showPicker();
              }}>
              {'Library'}
            </Text>
            <Text
              style={styles.modalOptionsText}
              onPress={() => {
                setShowUploadOptions(false);
              }}>
              {'Cancel'}
            </Text>
          </View>
        </Modal>
      </ScrollView>
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
    borderColor: '#cccccc',
    paddingHorizontal: 25,
  },
  modalOptionsText: {
    paddingVertical: 25,
    backgroundColor: '#fff',
    fontFamily: 'Avenir',
    lineHeight: 16,
    textAlign: 'center',
    fontSize: 14,
    color: '#3b3b3b',
  },
});

PredictionScreen.propTypes = {};

PredictionScreen.defaultProps = {};

const mapStateToProps = state => ({
  predictions: state.predictions,
});

const mapDispatchToProps = dispatch => ({
  fetchPredictions,
  getPredictions: payload => {
    console.log('dispatching now');
    dispatch(getPredictions(payload));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PredictionScreen);
