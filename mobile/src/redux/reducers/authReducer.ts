import { createLogger } from "../../utils/logger";
const __ykLog = createLogger("authReducer");
const initialState = {
  isLoggedIn: false,
  user: null,
  token: null
};
const authReducer = (state = initialState, action: any) => {
  const __ykStart = Date.now();
  const __ykOp = "authReducer.authReducer";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          isLoggedIn: true,
          user: action.payload,
          token: action.payload.token
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          isLoggedIn: false,
          error: action.payload
        };
      case 'LOGOUT':
        return initialState;
      default:
        return state;
    }
  } catch (__ykErr) {
    __ykOk = false;
    __ykLog.error("METHOD_END", {
      op: __ykOp,
      status: "failure",
      durationMs: Date.now() - __ykStart
    });
    throw __ykErr;
  } finally {
    if (__ykOk) __ykLog.info("METHOD_END", {
      op: __ykOp,
      status: "success",
      durationMs: Date.now() - __ykStart
    });
  }
};
export default authReducer;