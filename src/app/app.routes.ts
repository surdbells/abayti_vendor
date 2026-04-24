import { Routes } from '@angular/router';
import {LoginComponent} from './public/login/login.component';
import {UserComponent} from './vendor/user/user.component';
import {VendorNotificationsComponent} from './vendor/vendor-notifications/vendor-notifications.component';
import {UserProfileComponent} from './shared/user-profile/user-profile.component';
import {AdminComponent} from './backend/admin/admin.component';
import {VendorOrdersComponent} from './vendor/vendor-orders/vendor-orders.component';
import {VendorProductsComponent} from './vendor/vendor-products/vendor-products.component';
import {VendorReturnsComponent} from './vendor/vendor-returns/vendor-returns.component';
import {VendorReviewsComponent} from './vendor/vendor-reviews/vendor-reviews.component';
import {VendorMessagesComponent} from './vendor/vendor-messages/vendor-messages.component';
import {RegisterComponent} from './public/register/register.component';
import {ResetComponent} from './public/reset/reset.component';
import {CreateProductComponent} from './vendor/create-product/create-product.component';
import {VendorStoreComponent} from './settings/vendor-store/vendor-store.component';
import {UserSecurityComponent} from './shared/user-security/user-security.component';
import {VendorPaymentComponent} from './settings/vendor-payment/vendor-payment.component';
import {VendorTaxComponent} from './settings/vendor-tax/vendor-tax.component';
import {EditProductComponent} from './vendor/edit-product/edit-product.component';
import {HomeComponent} from './public/home/home.component';
import {LabelComponent} from './settings/labels/label.component';
import {VendorComplianceComponent} from './vendor/vendor-compliance/vendor-compliance.component';
import {CollectionsComponent} from './backend/collections/collections.component';
import {CreateCollectionComponent} from './backend/collections/create-collection/create-collection.component';
import {EditCollectionComponent} from './backend/collections/edit-collection/edit-collection.component';
import {StoresComponent} from './backend/stores/stores.component';
import {CustomersComponent} from './backend/customers/customers.component';
import {ManageStoreComponent} from './backend/stores/manage-store/manage-store.component';
import {SalesComponent} from './backend/sales/sales.component';
import {MeasurementsComponent} from './vendor/measurements/measurements.component';
import {ViewOrderComponent} from './vendor/view-order/view-order.component';
import {VendorDeliveryComponent} from './vendor/vendor-delivery/vendor-delivery.component';
import {ReceiptComponent} from './vendor/receipt/receipt.component';
import {StoreOrdersComponent} from './backend/stores/store-orders/store-orders.component';
import {StoreMessagesComponent} from './backend/stores/store-messages/store-messages.component';
import {StoreTicketsComponent} from './backend/stores/store-tickets/store-tickets.component';
import {StoreReviewsComponent} from './backend/stores/store-reviews/store-reviews.component';
import {StoreProductsComponent} from './backend/stores/store-products/store-products.component';
import {AdminViewOrderComponent} from './backend/admin-view-order/admin-view-order.component';
import {AdminProductsComponent} from './backend/admin-products/admin-products.component';
import {AdminViewProductComponent} from './backend/admin-view-product/admin-view-product.component';
import {StoreSalesComponent} from './backend/stores/store-sales/store-sales.component';
import {TransactionsComponent} from './backend/transactions/transactions.component';
import {TicketsComponent} from './backend/tickets/tickets.component';
import {TicketMessageComponent} from './backend/tickets/ticket-message/ticket-message.component';
import {CommissionsComponent} from './backend/commissions/commissions.component';
import {LogisticsComponent} from './backend/logistics/logistics.component';
import {ProcessingComponent} from './backend/processing/processing.component';
import {SingleComponent} from './backend/processing/single/single.component';
import {PluralComponent} from './backend/sales/plural/plural.component';
import {UsersComponent} from './backend/users/users.component';
import {DeliveriesComponent} from './backend/logistics/deliveries/deliveries.component';
import {CouponListComponent} from './coupon/coupon-list/coupon-list.component';
import {CreateCouponComponent} from './coupon/create-coupon/create-coupon.component';
import {EditCouponComponent} from './coupon/edit-coupon/edit-coupon.component';
import {CouponAnalyticsComponent} from './coupon/coupon-analytics/coupon-analytics.component';

export const routes: Routes = [
  {
    // TEMPORARY — Phase 2 review. Removed in Phase 11.
    path: 'design-system',
    loadComponent: () => import('./design-system/design-system.component').then(m => m.DesignSystemComponent),
    title: 'Design system preview'
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },{
    path: 'register',
    component: RegisterComponent,
    title: 'Register'
  },
  {
    path: 'account',
    component: UserComponent,
    title: 'Account'
  },
  {
    path: 'reset',
    component: ResetComponent,
    title: 'Reset password'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Sell More with Abayti'
  },
  {
    path: 'backend',
    component: AdminComponent,
    title: 'Account'
  },
  {
    path: 'notifications',
    component: VendorNotificationsComponent,
    title: 'Notifications'
  },
  {
    path: 'payment_info',
    component: VendorPaymentComponent,
    title: 'Payment information'
  },
  {
    path: 'tax_information',
    component: VendorTaxComponent,
    title: 'Tax Information'
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    title: 'Manage your profile'
  },
  {
    path: 'store',
    component: VendorStoreComponent,
    title: 'Manage your store'
  },
  {
    path: 'security',
    component: UserSecurityComponent,
    title: 'Security settings'
  },
  {
    path: 'orders',
    component: VendorOrdersComponent,
    title: 'Orders'
  },
  {
    path: 'admin_order',
    component: AdminViewOrderComponent,
    title: 'Orders'
  },
  {
    path: 'products',
    component: VendorProductsComponent,
    title: 'Products'
  },
  {
    path: 'create-product',
    component: CreateProductComponent,
    title: 'Create product'
  },
  {
    path: 'edit',
    component: EditProductComponent,
    title: 'Edit product'
  },
  {
    path: 'order',
    component: ViewOrderComponent,
    title: 'Manage order'
  },{
    path: 'receipt',
    component: ReceiptComponent,
    title: 'Receipt'
  },
  {
    path: 'returns',
    component: VendorReturnsComponent,
    title: 'Returns'
  },
  {
    path: 'reviews',
    component: VendorReviewsComponent,
    title: 'Reviews'
  },
  {
    path: 'labels',
    component: LabelComponent,
    title: 'Store labels'
  },
  {
    path: 'messages',
    component: VendorMessagesComponent,
    title: 'Messages'
  },
  {
    path: 'labels',
    component: LabelComponent,
    title: 'Preference'
  },
  {
    path: 'compliance',
    component: VendorComplianceComponent,
    title: 'Compliance'
  },
  {
    path: 'collections',
    component: CollectionsComponent,
    title: 'Collections'
  },
  {
    path: 'create_collections',
    component: CreateCollectionComponent,
    title: 'Create collection'
  },
  {
    path: 'edit_collection',
    component: EditCollectionComponent,
    title: 'Edit collection'
  },
  {
    path: 'stores',
    component: StoresComponent,
    title: 'Stores'
  },
  {
    path: 'customers',
    component: CustomersComponent,
    title: 'Customers'
  },
  {
    path: 'manage_store',
    component: ManageStoreComponent,
    title: 'Manage store'
  },
  {
    path: 'product_sales',
    component: SalesComponent,
    title: 'Product Sales'
  },
  {
    path: 'measurements',
    component: MeasurementsComponent,
    title: 'Measurements'
  },
  {
    path: 'store_orders',
    component: StoreOrdersComponent,
    title: 'StoreOrders'
  },
  {
    path: 'delivery',
    component: VendorDeliveryComponent,
    title: 'Delivery list'
  },
  {
    path: 'store_messages',
    component: StoreMessagesComponent,
    title: 'Store messages'
  },
  {
    path: 'store_tickets',
    component: StoreTicketsComponent,
    title: 'Store tickets'
  },
  {
    path: 'store_products',
    component: StoreProductsComponent,
    title: 'Store products'
  },
  {
    path: 'store_sales',
    component: StoreSalesComponent,
    title: 'Store sales'
  },
  {
    path: 'store_reviews',
    component: StoreReviewsComponent,
    title: 'Store reviews'
  },
  {
    path: 'admin_products',
    component: AdminProductsComponent,
    title: 'Products'
  },
  {
    path: 'adminviewproduct',
    component: AdminViewProductComponent,
    title: 'View product'
  },
  {
    path: 'adminsales',
    component: SalesComponent,
    title: 'View sales'
  },
  {
    path: 'admintransactions',
    component: TransactionsComponent,
    title: 'View transactions'
  },
  {
    path: 'admincommissions',
    component: CommissionsComponent,
    title: 'View commission'
  },
  {
    path: 'adminlogistics',
    component: LogisticsComponent,
    title: 'View delivery'
  },
  {
    path: 'admintickets',
    component: TicketsComponent,
    title: 'View ticket'
  },
  {
    path: 'ticket_messages',
    component: TicketMessageComponent,
    title: 'Ticket messages'
  },
  {
    path: 'processing',
    component: ProcessingComponent,
    title: 'ORDER PROCESSING'
  },
  {
    path: 'single',
    component: SingleComponent,
    title: 'MANAGE ORDER'
  },
  {
    path: 'plural',
    component: PluralComponent,
    title: 'VENDOR ORDERS'
  },
  {
    path: 'deliveries',
    component: DeliveriesComponent,
    title: 'VENDOR ORDERS'
  },
  {
    path: 'adminusers',
    component: UsersComponent,
    title: 'Platform Users'
  },
  {
    path: 'coupons',
    component: CouponListComponent,
    title: 'Coupons and Discounts'
  },
  {
    path: 'create-coupon',
    component: CreateCouponComponent,
    title: 'Create Coupon'
  },
  {
    path: 'edit-coupon',       // accessed via /edit-coupon?id=123
    component: EditCouponComponent,
    title: 'Edit Coupon'
  },
  {
    path: 'coupon-analytics',  // /coupon-analytics for overview, /coupon-analytics?id=123 for single coupon
    component: CouponAnalyticsComponent,
    title: 'Coupon Analytics'
  }
];
