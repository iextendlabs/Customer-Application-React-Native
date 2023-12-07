import {
  UPDATE_BOOKING,
} from "../ActionTypes";

const BookingReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_BOOKING:
      return [action.payload];
    default:
      return state;
  }
};

export default BookingReducers;
