export const fetchPredictions = payload => ({
  type: 'FETCH_PREDICTIONS',
  context: 'PredictionScreen',
  payload: payload,
});

export function getPredictions(payload) {
  console.log("kaus payload",payload)
  return async dispatch => {
    console.log("kaus came now",payload)
    try {
      dispatch({
        type: 'GET_PREDICTIONS',
        context: 'PredictionScreen',
      });
      let output = {};
      console.log("kaus came now11",payload)
      let formData = new FormData();
formData.append('file', payload?.docSource);
formData.append('requestSrc', 'mobile');

      await fetch('http://192.168.1.2:8080/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: {
          file: payload?.docSource,
          requestSrc: "mobile"
        },
      })
        .then(response => {
          console.log('::::Success Handler11-->', response);
          
          response.json()})
        .then(json => {
          console.log('::::Success Handler-->', json);
          output = json;
         dispatch({
            type: 'GET_PREDICTIONS_SUCCESS',
            context: 'PredictionScreen',
            payload: output,
          });
        })
        .catch(error => {
          console.log('::::Failure Handler-->', JSON.stringify(error), error);
          output = error;
         dispatch({
            type: 'GET_PREDICTIONS_FAILURE',
            context: 'PredictionScreen',
            payload: output,
          });
        });
      return output;
    } catch (error) {
      console.error(error);
    }
  };
}
