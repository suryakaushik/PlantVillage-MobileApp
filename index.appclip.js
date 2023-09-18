import { AppRegistry } from "react-native";

import App from './appClip/App';

global.APP_ENV = 'AppClip';

AppRegistry.registerComponent('PulseAppClip', () => App);
