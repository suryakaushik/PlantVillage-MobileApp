/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';


import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useContext,
  createContext,
} from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  useColorScheme,
  Dimensions,
} from 'react-native';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';

import {persistStore, persistReducer} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// import { PersistGate } from "redux-persist/integration/react"
// let persistor = persistStore(store);

import messaging from '@react-native-firebase/messaging';

import thunk from 'redux-thunk';
import Reducers from './app/store/reducers';

import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SplashScreen from 'react-native-splash-screen';
// import AppStack from './app/navigation/AppStack';

import HomeScreen from './app/features/HomeScreen';
import LoginScreen from './app/features/LoginScreen';
import RegisterScreen from './app/features/RegisterScreen';
import PredictionScreen from './app/features/PredictionScreen';
import ExploreScreen from './app/features/ExploreScreen';
import ConfirmationModal from './app/components/ConfirmationModal';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const store = createStore(
  Reducers,
  undefined,
  compose(
    applyMiddleware(thunk),
    // eslint-disable-next-line no-underscore-dangle
    window.navigator.userAgent
      ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      : compose,
  ),
);

const moment = require('moment');
console.log(moment().utc().format('YYYY-MM-DDTHH:mm:ss'));

function MainTab() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Plant Doctor'}}
        initialParams={{itemId: 42}}
      />
      <Tab.Screen name="Predict" component={PredictionScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
    </Tab.Navigator>
  );
}
export const ThemeContext = createContext();

function App() {
  const {role, setRole} = useState('Guest'); //Guest,User/Farmer,Service Provider

  const [orientation, setOrientation] = useState('portrait');
  const [deviceType, setDeviceType] = useState('phone');

  const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  const msp = (dim, limit) => {
    return dim.scale * dim.width >= limit || dim.scale * dim.height >= limit;
  };

  const isTablet = () => {
    const dim = Dimensions.get('screen');
    return (
      (dim.scale < 2 && msp(dim, 1000)) || (dim.scale >= 2 && msp(dim, 1900))
    );
  };

  const defTheme = useColorScheme();
  const [theme, setTheme] = useState(defTheme);
  const themeData = {theme, setTheme};
  useLayoutEffect(() => {
    SplashScreen.hide();
    const callback = () => {
      if (isPortrait()) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }

      if (isTablet()) {
        setDeviceType('tablet');
      } else {
        setDeviceType('phone');
      }
    };

    Dimensions.addEventListener('change', callback);

    return () => {
      Dimensions.removeEventListener('change', callback);
    };
  }, []);

  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log(token);
    } catch (e) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFCMToken();
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp: ', JSON.stringify(remoteMessage));
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            JSON.stringify(remoteMessage),
          );
        }
      });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);

  // npx uri-scheme open plantVillage://app/predict --android
  // adb shell am start -W -a android.intent.action.VIEW -d "plantVillage://app/predict" com.plantvillage
  // adb shell am start -n com.plantvillage.main/.activities.MainActivity
  const deepLinkConfig = {
    screens: {
      MainTab: {
        path: 'predict/:message',
        parse: {
          message: message => `${message}`,
        },
      },
      // PredictionScreen: 'predict',
    },
  };

  return (
    <ThemeContext.Provider value={themeData}>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}

        <NavigationContainer
          linking={{
            prefixes: ['plantVillage://app'],
            config: deepLinkConfig,
          }}
          theme={
            theme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme
          }>
          <View
            style={{
              height: StatusBar.currentHeight,
              backgroundColor: '#8cd9d1',
            }}>
            <StatusBar
              backgroundColor={'#8cd9d1'}
              barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
              translucent={false}
            />
          </View>
          <Stack.Navigator initialRouteName={'Login'}>
            <Stack.Group screenOptions={{headerShown: false}}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Group>
            <Stack.Screen
              name="MainTab"
              component={MainTab}
              options={{headerShown: false}}
            />
            {/* <Stack.Group screenOptions={{presentation: 'modal'}}>
              <Stack.Screen name="Confirm" component={ConfirmationModal} />
            </Stack.Group> */}
            {/* <AppStack /> */}
          </Stack.Navigator>
        </NavigationContainer>

        {/* </PersistGate> */}
      </Provider>
    </ThemeContext.Provider>
  );
}

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export default () => {
  return <App />;
};
