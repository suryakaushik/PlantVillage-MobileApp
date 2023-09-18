const persistConfig = {
	key: "root",
	version: 1,
	storage: AsyncStorage,
}
const rootReducer = combineReducers({
	counter: counterReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export default configureStore({
  reducer: persistedReducer
})