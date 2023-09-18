import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Text,
  BackHandler,
  TouchableOpacity,
} from 'react-native';

import Header, {headerHeight} from '../../components/Header';

import {useTheme} from '@react-navigation/native';

import PushController from '../../containers/PushController';
import DynamicInputScreen from '../../containers/DynamicInputs';
import PageTracking from '../../containers/PageTracking';
import HorizontalCalendar from '../../containers/SimpleHorizontalCalendar';
import CustomWebView from '../../containers/CustomWebView';

import LocationDetection from '../../components/LocationDetection';

function HomeScreen(props) {
  const {colors} = useTheme();
  let child = null;

  const onConsultationPress = () => {
    console.log('Checked A/V permissions and joined the call');
  };
  const [selectedDate, setSelectedDate] = useState(new Date());

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
          <Text style={{color: colors.text}}>Home Screen</Text>
        </View>
      </ScrollView>
      {/* <PushController /> */}
      {/* <HorizontalCalendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            /> */}
      {/* <PageTracking /> */}

      <LocationDetection
        onRef={ref => (child = ref)}
        navigation={props.navigation}
        onJoinCallPress={onConsultationPress}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          if (child) {
            child.detectLocation();
          } else {
            onConsultationPress();
          }
        }}>
        <Text style={{color: '#000'}}>{'Join the call'}</Text>
      </TouchableOpacity>
      {/* NOT WORKING */}
      {/* <DynamicInputScreen /> */}
      {/* <CustomWebView /> */}
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
