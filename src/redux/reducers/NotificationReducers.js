import {
  ClEAR_NOTIFICATION,
  UPDATE_NOTIFICATION,
} from "../ActionTypes";

const NotificationReducers = (state = [], action) => {
  switch (action.type) {
    case UPDATE_NOTIFICATION:
      return [action.payload];
    case ClEAR_NOTIFICATION:
      return [];
    default:
      return state;
  }
};

export default NotificationReducers;
