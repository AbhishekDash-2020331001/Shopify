// Models
export const USER_MODEL = "User";
export const BANK_MODEL = "Bank";
export const BANK_ACCOUNT_MODEL = "BankAccount"
export const TRANSACTION_MODEL = "Transaction"
export const PRODUCT_MODEL = "Product";
export const ORDER_MODEL = "Order";

// Roles
export const USER_ROLES = {
  customer: "Customer",
  eCommerce: "E-commerce",
  supplier: "Supplier",
  bank: "Bank"
};

// Order Status
export const ORDER_STATUS = {
  pending: "Pending",
  approvedUnpaid: "Approved Unpaid",
  approvedPaid: "Approved Paid",
  shipping: "Shipping",
  delivered: "Delivered",
  declined: "Declined"
}


// Tokens
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";

// Node Environment
export const NODE_ENVIRONMENTS = {
  development: "development",
  production: "production"
}