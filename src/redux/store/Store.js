import { createStore, combineReducers } from 'redux';
import cartReducers from "../reducers/CartReducers";
import wishlistReducers from "../reducers/WishlistReducers";
import addressReducers from "../reducers/AddressReducers";
import personalInformationReducers from "../reducers/PersonalInformationReducers";
import serviceReducers from "../reducers/ServiceReducers";
import zoneReducers from "../reducers/ZoneReducers";
import BookingReducers from '../reducers/BookingReducers';
import CouponReducers from '../reducers/CouponReducers';
import NotificationReducers from '../reducers/NotificationReducers';
import CategoryReducers from '../reducers/CategoryReducers';

const rootReducer = combineReducers({
  cart: cartReducers,     
  wishlist: wishlistReducers,
  address: addressReducers,
  personalInformation: personalInformationReducers,
  services: serviceReducers,
  zones: zoneReducers,
  booking: BookingReducers,
  coupon: CouponReducers,
  Notifications: NotificationReducers,
  categories: CategoryReducers,
});

const store = createStore(rootReducer);

export default store;
