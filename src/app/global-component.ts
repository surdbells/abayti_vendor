export class GlobalComponent {

  constructor() {}
  public static baseURL = 'https://api.3bayti.com/' // test

  // POST REQUEST
   public static UserLogin = GlobalComponent.baseURL + 'users/login';
   public static UserRegister = GlobalComponent.baseURL + 'users/register';
   public static UserValidate = GlobalComponent.baseURL + 'users/validate';
   public static EmailValidate = GlobalComponent.baseURL + 'users/validate-email';
   public static UserReset = GlobalComponent.baseURL + 'users/reset';
   public static UserConfirm = GlobalComponent.baseURL + 'users/confirm';
   public static UserResetPassword = GlobalComponent.baseURL + 'users/reset';
   public static UserSettings = GlobalComponent.baseURL + 'users/settings';

   public static createLabel = GlobalComponent.baseURL + 'vendors/labels/create-label';
   public static readLabel = GlobalComponent.baseURL + 'vendors/labels/read-label';

   public static getVendorOrders = GlobalComponent.baseURL + 'vendors/orders/get-orders';
   public static getOrderItems = GlobalComponent.baseURL + 'vendors/orders/get-order-items';
   public static updateOrderStatus =  GlobalComponent.baseURL + 'vendors/orders/update-order-status';

   public static getProductById = GlobalComponent.baseURL + 'vendors/products/getProductById';
   public static deleteProductById = GlobalComponent.baseURL + 'vendors/products/delete-product';
  public static getProduct = GlobalComponent.baseURL + 'vendors/products/get-products';
  public static createProduct = GlobalComponent.baseURL + 'vendors/products/create-product';
  public static updateProduct = GlobalComponent.baseURL + 'vendors/products/update-product';
  public static getProductReviews = GlobalComponent.baseURL + 'vendors/products/get-products-reviews';


   public static getNotifications = GlobalComponent.baseURL + 'vendors/common/notifications';
   public static markNotifications = GlobalComponent.baseURL + 'vendors/common/mark_notifications';
  public static getVendorStats = GlobalComponent.baseURL + 'vendors/common/dashboard-activity';


   public static getVendorProfile = GlobalComponent.baseURL + 'vendors/settings/vendor-user';
   public static getVendorStore = GlobalComponent.baseURL + 'vendors/settings/vendor-store';
   public static getVendorPayment = GlobalComponent.baseURL + 'vendors/settings/vendor-store-payment';

   public static getVendorTax = GlobalComponent.baseURL + 'vendors/settings/vendor-store-tax';
   public static getVendorNotifications = GlobalComponent.baseURL + 'vendors/settings/vendor-store-notifications';
   public static topSelling = GlobalComponent.baseURL + 'vendors/common/top-selling';
   public static updateUserProfile = GlobalComponent.baseURL + 'vendors/settings/update-user-basic';
   public static updateStoreBasic = GlobalComponent.baseURL + 'vendors/settings/update-vendor-store';
   public static updateStorePayment = GlobalComponent.baseURL + 'vendors/settings/update-vendor-payment';
   public static updateStoreTax = GlobalComponent.baseURL + 'vendors/settings/update-vendor-tax';
   public static updateStoreNotifications = GlobalComponent.baseURL + 'vendors/settings/update-vendor-notifications';
   public static updateStoreStatus = GlobalComponent.baseURL + 'vendors/settings/switch-store-status';
   public static updateUserPassword = GlobalComponent.baseURL + 'vendors/settings/change-user-password';

   // GET REQUEST
    public static UtilityCategory = GlobalComponent.baseURL + 'utility/category';
    public static UtilityCollections = GlobalComponent.baseURL + 'utility/collections';

  static validateEmail(email: string) {
    return !!email.match(/(?:[a-z0-9+!#$%&'*\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/gi);
  }
  static validateNumber(number: string){
    let numbers = /^[0-9]+$/;
    return !!number.match(numbers);
  }
  static decodeJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
}
