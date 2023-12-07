import {
  UPDATE_ZONE,
} from "../ActionTypes";

const ZoneReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_ZONE:
      return [action.payload];
    default:
      return state;
  }
};

export default ZoneReducers;
