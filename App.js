/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useContext, createContext } from 'react';
import { View, Button, Text, ActivityIndicator, StatusBar, useColorScheme } from 'react-native';

import { NavigationContainer, DefaultTheme as NavigationDefaultTheme, DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen from "react-native-splash-screen";

import HomeScreen from "./app/features/HomeScreen";
import LoginScreen from "./app/features/LoginScreen";
import RegisterScreen from "./app/features/RegisterScreen";
import PredictionScreen from "./app/features/PredictionScreen";
import ExploreScreen from "./app/features/ExploreScreen";
import ConfirmationModal from "./app/components/ConfirmationModal";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const moment = require("moment");
console.log(moment().utc().format("YYYY-MM-DDTHH:mm:ss"));

function MainTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Plant Doctor' }} initialParams={{ itemId: 42 }} />
      <Tab.Screen name="Predict" component={PredictionScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
    </Tab.Navigator>
  );
}
export const ThemeContext = createContext();

function App() {
  const { isLoggedIn, setIsLoggedIn } = useState(false);
  const { role, setRole } = useState('Guest');//Guest,User/Farmer,Service Provider

  const defTheme = useColorScheme();
  const [theme, setTheme] = useState(defTheme);
  const themeData = { theme, setTheme };
  useEffect(() => {
    // setTheme(defTheme);
    SplashScreen.hide();
  }, []);

  return (
    <ThemeContext.Provider value={themeData}>
      <NavigationContainer theme={theme === 'dark' ? NavigationDarkTheme : NavigationDefaultTheme}>
        <StatusBar
          backgroundColor={"#8cd9d1"}
          barStyle={'dark-content'}
          translucent={false} />
        <Stack.Navigator initialRouteName={isLoggedIn ? "MainTab" : "Login"}>
          <Stack.Group screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Group>
          <Stack.Screen
            name="MainTab"
            component={MainTab}
            options={{ headerShown: false }} />
          {/* <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="Confirm" component={ConfirmationModal} />
        </Stack.Group> */}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};

export default () => {
  return <App />;
};










// import MainTabScreen from './screens/MainTabScreen';
// import SupportScreen from './screens/SupportScreen';
// import SettingsScreen from './screens/SettingsScreen';
// import BookmarkScreen from './screens/BookmarkScreen';

// import { AuthContext } from './components/context';

// import RootStackScreen from './screens/RootStackScreen';

// import AsyncStorage from '@react-native-community/async-storage';

// const Drawer = createDrawerNavigator();

// const App = () => {
//   // const [isLoading, setIsLoading] = React.useState(true);
//   // const [userToken, setUserToken] = React.useState(null); 

//   const initialLoginState = {
//     isLoading: true,
//     userName: null,
//     userToken: null,
//   };



//   const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

//   const loginReducer = (prevState, action) => {
//     switch( action.type ) {
//       case 'RETRIEVE_TOKEN': 
//         return {
//           ...prevState,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'LOGIN': 
//         return {
//           ...prevState,
//           userName: action.id,
//           userToken: action.token,
//           isLoading: false,
//         };
//       case 'LOGOUT': 
//         return {
//           ...prevState,
//           userName: null,
//           userToken: null,
//           isLoading: false,
//         };
//       case 'REGISTER': 
//         return {
//           ...prevState,
//           userName: action.id,
//           userToken: action.token,
//           isLoading: false,
//         };
//     }
//   };

//   const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

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
//     signUp: () => {
//       // setUserToken('fgkj');
//       // setIsLoading(false);
//     },
//     toggleTheme: () => {
//       setIsDarkTheme( isDarkTheme => !isDarkTheme );
//     }
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

//   if( loginState.isLoading ) {
//     return(
//       <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
//         <ActivityIndicator size="large"/>
//       </View>
//     );
//   }
//   return (
//     <PaperProvider theme={theme}>
//     <AuthContext.Provider value={authContext}>
//     <NavigationContainer theme={theme}>
//       { loginState.userToken !== null ? (
//         <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
//           <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
//           <Drawer.Screen name="SupportScreen" component={SupportScreen} />
//           <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
//           <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
//         </Drawer.Navigator>
//       )
//     :
//       <RootStackScreen/>
//     }
//     </NavigationContainer>
//     </AuthContext.Provider>
//     </PaperProvider>
//   );
// }

// export default App;