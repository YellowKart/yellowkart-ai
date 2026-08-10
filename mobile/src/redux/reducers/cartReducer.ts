import { createLogger } from "../../utils/logger";
const __ykLog = createLogger("cartReducer");
const initialState = {
  items: [],
  total: 0
};
const cartReducer = (state = initialState, action: any) => {
  const __ykStart = Date.now();
  const __ykOp = "cartReducer.cartReducer";
  __ykLog.info("METHOD_START", {
    op: __ykOp
  });
  let __ykOk = true;
  try {
    switch (action.type) {
      case 'ADD_TO_CART':
        {
          const existingItem = state.items.find(item => item.productId === action.payload.productId);
          if (existingItem) {
            const __ykBlockStart1 = Date.now();
            __ykLog.info("BLOCK_START", {
              op: "cartReducer#if1"
            });
            try {
              return {
                ...state,
                items: state.items.map(item => item.productId === action.payload.productId ? {
                  ...item,
                  quantity: item.quantity + 1
                } : item)
              };
            } finally {
              __ykLog.info("BLOCK_END", {
                op: "cartReducer#if1",
                durationMs: Date.now() - __ykBlockStart1
              });
            }
          }
          return {
            ...state,
            items: [...state.items, action.payload]
          };
        }
      case 'REMOVE_FROM_CART':
        return {
          ...state,
          items: state.items.filter(item => item.productId !== action.payload)
        };
      case 'UPDATE_CART_TOTAL':
        return {
          ...state,
          total: action.payload
        };
      case 'CLEAR_CART':
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
export default cartReducer;