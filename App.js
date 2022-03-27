/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
} from 'react-native';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';

// import {persistStore, persistReducer} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

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

  const defTheme = useColorScheme();
  const [theme, setTheme] = useState(defTheme);
  const themeData = {theme, setTheme};
  useLayoutEffect(() => {
    SplashScreen.hide();
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
            {/* <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Confirm" component={ConfirmationModal} />
        </Stack.Group> */}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ThemeContext.Provider>
  );
}

export default () => {
  return <App />;
};

// import AsyncStorage from '@react-native-community/async-storage';
// const App = () => {
//   const authContext = React.useMemo(() => ({
//     signIn: async(foundUser) => {
//       // setUserToken('fgkj');
//       // setIsLoading(false);
//       const userToken = String(foundUser[0].userToken);
//       const userName = foundUser[0].username;

//       try {
//         await AsyncStorage.setItem('userToken', userToken);
//       } catch(e) {
//         console.log(e);
//       }
//       // console.log('user token: ', userToken);
//       dispatch({ type: 'LOGIN', id: userName, token: userToken });
//     },
//     signOut: async() => {
//       // setUserToken(null);
//       // setIsLoading(false);
//       try {
//         await AsyncStorage.removeItem('userToken');
//       } catch(e) {
//         console.log(e);
//       }
//       dispatch({ type: 'LOGOUT' });
//     },
//   }), []);

//   useEffect(() => {
//     setTimeout(async() => {
//       // setIsLoading(false);
//       let userToken;
//       userToken = null;
//       try {
//         userToken = await AsyncStorage.getItem('userToken');
//       } catch(e) {
//         console.log(e);
//       }
//       // console.log('user token: ', userToken);
//       dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
//     }, 1000);
//   }, []);
// }
