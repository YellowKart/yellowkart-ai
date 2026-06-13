const initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
}

const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
        token: action.payload.token,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return initialState
    default:
      return state
  }
}

export default authReducer
