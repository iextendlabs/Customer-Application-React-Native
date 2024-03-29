import {
  ADD_ADDRESS,
  ADD_PERSONAL_INFORMATION,
  ADD_TO_CART,
  ADD_TO_WISHLIST,
  CLEAR_ADDRESS,
  CLEAR_CART,
  CLEAR_PERSONAL_INFORMATION,
  CLEAR_WISHLIST,
  ClEAR_COUPON,
  ClEAR_NOTIFICATION,
  DELETE_ADDRESS,
  DELETE_PERSONAL_INFORMATION,
  REMOVE_FROM_CART,
  REMOVE_FROM_WISHLIST,
  UPDATE_BOOKING,
  UPDATE_COUPON,
  UPDATE_NOTIFICATION,
  UPDATE_SERVICES,
  UPDATE_CATEGORY,
  UPDATE_ZONE,
  UPDATE_AFFILIATE,
  ClEAR_AFFILIATE
} from "../ActionTypes";

export const updateServices = (data) => ({
  type: UPDATE_SERVICES,
  payload: data,
});

export const updateCategories = (data) => ({
  type: UPDATE_CATEGORY,
  payload: data,
});

export const updateCoupon = (data) => ({
  type: UPDATE_COUPON,
  payload: data,
});

export const clearCoupon = () => ({
  type: ClEAR_COUPON
});

export const updateAffiliate = (data) => ({
  type: UPDATE_AFFILIATE,
  payload: data,
});

export const clearAffiliate = () => ({
  type: ClEAR_AFFILIATE
});

export const updateBooking = (data) => ({
  type: UPDATE_BOOKING,
  payload: data,
});

export const updateZone = (data) => ({
  type: UPDATE_ZONE,
  payload: data,
});

export const addItemToCart = (data) => ({
  type: ADD_TO_CART,
  payload: data,
});

export const removeFromCart = (index) => ({
  type: REMOVE_FROM_CART,
  payload: index,
});

export const clearCart = () => ({
  type: CLEAR_CART
});

export const addItemToWishlist = (data) => ({
  type: ADD_TO_WISHLIST,
  payload: data,
});

export const removeFromWishlist = (index) => ({
  type: REMOVE_FROM_WISHLIST,
  payload: index,
});

export const clearWishlist = () => ({
  type: CLEAR_WISHLIST
});

export const addAddress = (data) => ({
  type: ADD_ADDRESS,
  payload: data,
});

export const deleteAddress = (index) => ({
  type: DELETE_ADDRESS,
  payload: index,
});

export const clearAddress = () => ({
  type: CLEAR_ADDRESS
});

export const addPersonalInformation = (data) => ({
  type: ADD_PERSONAL_INFORMATION,
  payload: data,
});

export const deletePersonalInformation = (index) => ({
  type: DELETE_PERSONAL_INFORMATION,
  payload: index,
});

export const clearPersonalInformation = () => ({
  type: CLEAR_PERSONAL_INFORMATION
});

export const updateNotification = (data) => ({
  type: UPDATE_NOTIFICATION,
  payload: data,
});

export const clearNotification = () => ({
  type: ClEAR_NOTIFICATION
});