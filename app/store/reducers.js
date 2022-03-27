import { combineReducers } from 'redux';

import PredictionReducer from "../features/PredictionScreen/reducers/PredictionReducer";
import AuthReducer from "../features/LoginScreen/reducers/AuthReducer";
// import NavigationReducer from "../features/PredictionScreen/reducers/NavigationReducer";

export default combineReducers({
  predictions: PredictionReducer,
  auth: AuthReducer,
  // nav: NavigationReducer,
});