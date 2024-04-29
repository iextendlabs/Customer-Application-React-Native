import {
  UPDATE_CUSTOMER_ZONE,
} from "../ActionTypes";

const CustomerZoneReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_CUSTOMER_ZONE:
      return [action.payload];
    default:
      return state;
  }
};

export default CustomerZoneReducers;
