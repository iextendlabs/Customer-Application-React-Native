import {
  UPDATE_COUPON,
} from "../ActionTypes";

const CouponReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_COUPON:
      return [action.payload];
    default:
      return state;
  }
};

export default CouponReducers;
