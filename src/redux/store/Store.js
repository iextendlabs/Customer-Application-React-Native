import { createStore, combineReducers } from 'redux';
import cartReducers from "../reducers/CartReducers";
import wishlistReducers from "../reducers/WishlistReducers";
import addressReducers from "../reducers/AddressReducers";
import personalInformationReducers from "../reducers/PersonalInformationReducers";
import serviceReducers from "../reducers/ServiceReducers";

const rootReducer = combineReducers({
  cart: cartReducers,     
  wishlist: wishlistReducers,
  address: addressReducers,
  personalInformation: personalInformationReducers,
  services: serviceReducers
});

const store = createStore(rootReducer);

export default store;
