import { createStore, combineReducers } from 'redux';
import cartReducers from "../reducers/CartReducers";
import wishlistReducers from "../reducers/WishlistReducers";
import addressReducers from "../reducers/AddressReducers";

const rootReducer = combineReducers({
  cart: cartReducers,         // Renamed for clarity
  wishlist: wishlistReducers,    // Renamed for clarity
  address: addressReducers,    // Renamed for clarity
});

const store = createStore(rootReducer);

export default store;
