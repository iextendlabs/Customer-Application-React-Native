import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from "../ActionTypes";

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
      return []; // Reset the cart to an empty array
    default:
      return state;
  }
};

export default cartReducers;
