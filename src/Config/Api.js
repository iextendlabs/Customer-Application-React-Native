const BaseUrl = "https://lipslay.com/";

const LoginUrl = BaseUrl + "api/customerLogin";
const SignupUrl = BaseUrl + "api/customerSignup";
const applyCouponAffiliateUrl = BaseUrl + "api/applyCouponAffiliate";
const appIndex = BaseUrl + "api/appIndex";
const availableTimeSlotUrl = BaseUrl + "api/availableTimeSlot?";
const getOrdersUrl = BaseUrl + "api/getOrders?";
const getServiceUrl = BaseUrl + "api/getServiceDetails?service_id=";
const editOrderUrl = BaseUrl + "api/editOrder?";
const AddOrderUrl = BaseUrl + "api/addOrder";
const UpdateOrderUrl = BaseUrl + "api/updateOrder";
const filterServicesUrl = BaseUrl + "api/filterServices?";
const UpdateCustomerInfoUrl = BaseUrl + "api/updateCustomerInfo";
const orderPDFDownloadUrl = BaseUrl + "api/order-download-pdf/";
const writeReviewUrl = BaseUrl + "api/writeReview";
const getCustomerCouponUrl = BaseUrl + "api/getCustomerCoupon?";
const NotificationUrl = BaseUrl + "api/customerNotification?";
const ChatUrl = BaseUrl+'api/customerChat?';
const AddChatUrl = BaseUrl+'api/addCustomerChat';
const PasswordResetUrl = BaseUrl + "api/passwordReset";
const StaffUrl = BaseUrl + "api/staff/";
const DeleteAccountUrl = BaseUrl + "api/deleteAccountMail?";
const SubCategoriesUrl = BaseUrl + "api/subCategories?id=";
const appOfferUrl = BaseUrl + "api/appOffer";
const checkUser = BaseUrl + "api/checkUser?id=";
const cancelOrder = BaseUrl + "api/cancelOrder?order_id=";
const signInWithFBUrl = BaseUrl + "api/signInWithFB";
const orderTotalURL = BaseUrl + "api/orderTotal";
const joinAffiliateURL = BaseUrl + "api/apply-affiliate";
export {
  LoginUrl,
  SignupUrl,
  appIndex,
  BaseUrl,
  availableTimeSlotUrl,
  AddOrderUrl,
  getOrdersUrl,
  editOrderUrl,
  UpdateOrderUrl,
  filterServicesUrl,
  getServiceUrl,
  UpdateCustomerInfoUrl,
  applyCouponAffiliateUrl,
  orderPDFDownloadUrl,
  writeReviewUrl,
  getCustomerCouponUrl,
  NotificationUrl,
  ChatUrl,
  AddChatUrl,
  PasswordResetUrl,
  StaffUrl,
  DeleteAccountUrl,
  SubCategoriesUrl,
  appOfferUrl,
  checkUser,
  cancelOrder,
  signInWithFBUrl,
  orderTotalURL,
  joinAffiliateURL
};
