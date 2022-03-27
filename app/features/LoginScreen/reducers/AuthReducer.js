const INITIAL_STATE = {
  isLoggedIn: false,
  isRegistered: false,
  loginObj: {
    userId: '',
    password: '',
  },
  loginError: false,
  loginLoading: false,
  regObj: {
    firstName: '',
    lastName: '',
    userId: '',
    password: '',
    country: '',
    language: '',
  },
  regError: false,
  regLoading: false,
  language: '',
};

const AuthReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE': {
      return {
        ...state,
      };
    }
    case 'SET_LANGUAGE_SUCCESS': {
      return {
        ...state,
        language: action.payload,
      };
    }
    case 'SET_LANGUAGE_FAILURE': {
      return {
        ...state,
      };
    }
    case 'LOGIN': {
      console.log("fromReducer->INIT", action);
      return {
        ...state,
        loginObj: {},
        loginError: false,
        loginLoading: true,
      };
    }
    case 'LOGIN_SUCCESS': {
      console.log("fromReducer->SUCCESS", action);
      return {
        ...state,
        loginObj: action.payload,
        loginError: false,
        loginLoading: false,

        isLoggedIn: true,
        isRegistered: true,
      };
    }
    case 'LOGIN_FAILURE': {
      console.log("fromReducer->FAILURE", action);
      return {
        ...state,
        loginObj: action.payload,
        loginError: true,
        loginLoading: false,

        isLoggedIn: false,
      };
    }
    case 'REGISTER': {
      return {
        ...state,
        regObj: {},
        regError: false,
        regLoading: true,
      };
    }
    case 'REGISTER_SUCCESS': {
      return {
        ...state,
        regObj: action.payload,
        regError: false,
        regLoading: false,

        isRegistered: true,
      };
    }
    case 'REGISTER_FAILURE': {
      return {
        ...state,
        regObj: action.payload,
        regError: true,
        regLoading: false,

        isRegistered: false,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
