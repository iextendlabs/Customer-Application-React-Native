import {
  UPDATE_SERVICES,
} from "../ActionTypes";

const ServiceReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_SERVICES:
      return [action.payload];
    default:
      return state;
  }
};

export default ServiceReducers;
