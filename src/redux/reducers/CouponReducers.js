import {
  ClEAR_COUPON,
  UPDATE_COUPON,
} from "../ActionTypes";

const CouponReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_COUPON:
      return [action.payload];
    case ClEAR_COUPON:
      return [];
    default:
      return state;
  }
};

export default CouponReducers;
