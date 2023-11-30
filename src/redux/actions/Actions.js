import {
  ADD_ADDRESS,
  ADD_PERSONAL_INFORMATION,
  ADD_TO_CART,
  ADD_TO_WISHLIST,
  CLEAR_CART,
  DELETE_ADDRESS,
  DELETE_PERSONAL_INFORMATION,
  REMOVE_FROM_CART,
  REMOVE_FROM_WISHLIST,
} from "../ActionTypes";

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

export const addAddress = (data) => ({
  type: ADD_ADDRESS,
  payload: data,
});

export const deleteAddress = (index) => ({
  type: DELETE_ADDRESS,
  payload: index,
});

export const addPersonalInformation = (data) => ({
  type: ADD_PERSONAL_INFORMATION,
  payload: data,
});

export const deletePersonalInformation = (index) => ({
  type: DELETE_PERSONAL_INFORMATION,
  payload: index,
});
