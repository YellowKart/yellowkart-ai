const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
}

const productReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'FETCH_PRODUCTS_REQUEST':
      return { ...state, loading: true }
    case 'FETCH_PRODUCTS_SUCCESS':
      return { ...state, products: action.payload, loading: false }
    case 'FETCH_PRODUCTS_FAILURE':
      return { ...state, error: action.payload, loading: false }
    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.payload }
    default:
      return state
  }
}

export default productReducer
