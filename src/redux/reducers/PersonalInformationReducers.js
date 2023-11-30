import {
  ADD_PERSONAL_INFORMATION,
  DELETE_PERSONAL_INFORMATION
} from "../ActionTypes";

const personalInformationReducers = (state = [], action) => {
  switch (action.type) {
    case ADD_PERSONAL_INFORMATION:
      return [...state, action.payload];
    case DELETE_PERSONAL_INFORMATION:
      const deletedArray = state.filter(
        (item, index) => index !== action.payload
      );
      return deletedArray;
    default:
      return state;
  }
};

export default personalInformationReducers;
