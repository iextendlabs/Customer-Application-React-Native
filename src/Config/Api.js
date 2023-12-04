const BaseUrl = "https://test.lipslay.com/";

const LoginUrl = BaseUrl + "api/customerLogin";
const SignupUrl = BaseUrl + "api/customerSignup";
const appIndex = BaseUrl + "api/appIndex";
const availableTimeSlotUrl = BaseUrl + "api/availableTimeSlot?";
const getOrdersUrl = BaseUrl + "api/getOrders?";
const getServiceUrl = BaseUrl + "api/getServiceDetails?service_id=";
const editOrderUrl = BaseUrl + "api/editOrder?";
const AddOrderUrl = BaseUrl + "api/addOrder";
const UpdateOrderUrl = BaseUrl + "api/updateOrder";
const getStaffZoneUrl = BaseUrl + "api/getZones";
const filterServicesUrl = BaseUrl + "api/filterServices?";
export {
  LoginUrl,
  SignupUrl,
  appIndex,
  BaseUrl,
  availableTimeSlotUrl,
  AddOrderUrl,
  getOrdersUrl,
  getStaffZoneUrl,
  editOrderUrl,
  UpdateOrderUrl,
  filterServicesUrl,
  getServiceUrl
};
