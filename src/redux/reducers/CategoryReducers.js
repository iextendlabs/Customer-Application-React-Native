import {
  UPDATE_CATEGORY,
} from "../ActionTypes";

const CategoryReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_CATEGORY:
      return [action.payload];
    default:
      return state;
  }
};

export default CategoryReducers;
