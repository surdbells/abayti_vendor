import { Routes } from '@angular/router';
import {LoginComponent} from './public/login/login.component';
import {UserComponent} from './vendor/user/user.component';
import {VendorNotificationsComponent} from './settings/vendor-notifications/vendor-notifications.component';
import {VendorProfileComponent} from './settings/vendor-profile/vendor-profile.component';
import {AdminComponent} from './backend/admin/admin.component';
import {VendorCouponsComponent} from './vendor/vendor-coupons/vendor-coupons.component';
import {VendorOrdersComponent} from './vendor/vendor-orders/vendor-orders.component';
import {VendorProductsComponent} from './vendor/vendor-products/vendor-products.component';
import {VendorReturnsComponent} from './vendor/vendor-returns/vendor-returns.component';
import {VendorReviewsComponent} from './vendor/vendor-reviews/vendor-reviews.component';
import {VendorTransactionsComponent} from './vendor/vendor-transactions/vendor-transactions.component';
import {VendorMessagesComponent} from './vendor/vendor-messages/vendor-messages.component';
import {RegisterComponent} from './public/register/register.component';
import {ResetComponent} from './public/reset/reset.component';
import {CreateProductComponent} from './vendor/create-product/create-product.component';
import {VendorStoreComponent} from './settings/vendor-store/vendor-store.component';
import {VendorSecurityComponent} from './settings/vendor-security/vendor-security.component';
import {VendorPaymentComponent} from './settings/vendor-payment/vendor-payment.component';
import {VendorTaxComponent} from './settings/vendor-tax/vendor-tax.component';
import {EditProductComponent} from './vendor/edit-product/edit-product.component';

export const routes: Routes = [
  {
    path: '',
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
    component: VendorProfileComponent,
    title: 'Manage your profile'
  },
  {
    path: 'store',
    component: VendorStoreComponent,
    title: 'Manage your store'
  },
  {
    path: 'security',
    component: VendorSecurityComponent,
    title: 'Security settings'
  },
  {
    path: 'coupons',
    component: VendorCouponsComponent,
    title: 'Coupons & Discounts'
  },
  {
    path: 'orders',
    component: VendorOrdersComponent,
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
    path: 'edit-product',
    component: EditProductComponent,
    title: 'Edit product'
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
    path: 'transactions',
    component: VendorTransactionsComponent,
    title: 'Transactions'
  },
  {
    path: 'messages',
    component: VendorMessagesComponent,
    title: 'Messages'
  }
];
