const initialState = {
  items: [],
  total: 0,
};

const cartReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload),
      };
    case 'UPDATE_CART_TOTAL':
      return {
        ...state,
        total: action.payload,
      };
    case 'CLEAR_CART':
      return initialState;
    default:
      return state;
  }
};

export default cartReducer;
