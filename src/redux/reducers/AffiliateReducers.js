import {
  ClEAR_AFFILIATE,
  UPDATE_AFFILIATE,
} from "../ActionTypes";

const AffiliateReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_AFFILIATE:
      return [action.payload];
    case ClEAR_AFFILIATE:
      return [];
    default:
      return state;
  }
};

export default AffiliateReducers;
