import {
  UPDATE_GENDER_PERMISSION,
} from "../ActionTypes";

const GenderReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_GENDER_PERMISSION:
      return [action.payload];
    default:
      return state;
  }
};

export default GenderReducers;
