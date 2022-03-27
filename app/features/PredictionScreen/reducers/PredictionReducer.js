const INITIAL_STATE = {
    predictions: {},
    predictionError: false,
    predictionLoading: false,
};

const PredictionReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "FETCH_PREDICTIONS": {
            return {
                ...state,
                predictions: {},
                predictionError: false,
                predictionLoading: true,
            }
        }
        case "FETCH_PREDICTIONS_SUCCESS": {
            return {
                ...state,
                predictions: action.payload.body,
                predictionError: false,
                predictionLoading: false,
            }
        }
        case "FETCH_PREDICTIONS_FAILURE": {
            return {
                ...state,
                predictions: {},
                predictionError: true,
                predictionLoading: false,
            }
        }
        case "GET_PREDICTIONS": {
            return {
                ...state,
                predictions: {},
                predictionError: false,
                predictionLoading: true,
            }
        }
        case "GET_PREDICTIONS_SUCCESS": {
            return {
                ...state,
                predictions: action.payload.body,
                predictionError: false,
                predictionLoading: false,
            }
        }
        case "GET_PREDICTIONS_FAILURE": {
            return {
                ...state,
                predictions: {},
                predictionError: true,
                predictionLoading: false,
            }
        }
        default:
            return state;
    }
};

export default PredictionReducer;
