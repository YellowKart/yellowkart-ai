import { createLogger } from "../../utils/logger";
const __ykLog = createLogger("productReducer");
const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null
};
const productReducer = (state = initialState, action: any) => {
  const __ykStart = Date.now();
  const __ykOp = "productReducer.productReducer";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    switch (action.type) {
      case 'FETCH_PRODUCTS_REQUEST':
        return {
          ...state,
          loading: true
        };
      case 'FETCH_PRODUCTS_SUCCESS':
        return {
          ...state,
          products: action.payload,
          loading: false
        };
      case 'FETCH_PRODUCTS_FAILURE':
        return {
          ...state,
          error: action.payload,
          loading: false
        };
      case 'SELECT_PRODUCT':
        return {
          ...state,
          selectedProduct: action.payload
        };
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
export default productReducer;