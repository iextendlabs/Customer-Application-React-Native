import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART, UPDATE_OR_ADD_TO_CART } from "../ActionTypes";

const cartReducers = (state = [], action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return [...state, action.payload];
    case REMOVE_FROM_CART:
      const deletedArray = state.filter(
        (item, index) => index !== action.payload
      );
      return deletedArray;
    case CLEAR_CART:
      return [];
    case UPDATE_OR_ADD_TO_CART:
      const index = state.findIndex(item => item.service_id === action.payload.service_id);
      if (index !== -1) {
        return state.map((item, i) => i === index ? action.payload : item);
      }
      return [...state, action.payload];
    default:
      return state;
  }
};

export default cartReducers;
