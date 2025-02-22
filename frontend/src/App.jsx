import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { SignupPage } from "./pages/auth/SignupPage";
import { BillingInfoPage } from "./pages/auth/BillingInfoPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { PageLayout } from "./layouts/PageLayout";
import { HomePageCustomer } from "./pages/HomePageCustomer";
import { CartPage } from "./pages/CartPage";
import { PaymentPage } from "./pages/PaymentPage";
import { Success } from "./components/Success";
import { Failure } from "./components/Failure";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { BankAccountPage } from "./pages/BankAccountPage";
import { HomePageECommerce } from "./pages/HomePageECommerce";
import { HomePageBank } from "./pages/HomePageBank";
import { HomePageSupplier } from "./pages/HomePageSupplier";
import { TransactionHistoryPage } from "./pages/TransactionHistoryPage";
import { BankAccountsPage } from "./pages/BankAccountsPage";
import { AddMoneyPage } from "./pages/AddMoneyPage";
import { CreateBankAccountPage } from "./pages/CreateBankAccountPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CreateProductPage } from "./pages/CreateProductPage";
import { DeliveryRequestPage } from "./pages/DeliveryRequestPage";
import { LoadingPage } from "./pages/LoadingPage";
import { ErrorPage } from "./pages/ErrorPage";

export const App = () => {
  const { loading, error, user } = useSelector((state) => state.auth);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error}/>;
  }

  return (
    <Routes>
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />

      {/* Page Layout Route */}
      {user && (
        <>
          <Route
            path="/"
            element={user.role !== "Bank" && !user.accountNo ? <Navigate to="/billing-info" /> : <PageLayout />}
          >
            {/* Bank Routes */}
            {user.role === "Bank" && (
              <>
                <Route path="/" element={<HomePageBank />} />
                <Route path="/bank-accounts" element={<BankAccountsPage />} />
                <Route path="/create-bank-account" element={<CreateBankAccountPage />} />
                <Route path="/transaction-history" element={<TransactionHistoryPage />} />
              </>
            )}

            {/* Customer Routes */}
            {user.role === "Customer" && user.accountNo && (
              <>
                <Route path="/" element={<HomePageCustomer />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order-history" element={<OrderHistoryPage />} />
              </>
            )}

            {/* E-commerce Routes */}
            {user.role === "E-commerce" && user.accountNo && (
              <>
                <Route path="/" element={<HomePageECommerce />} />
                <Route path="/delivery-requests" element={<DeliveryRequestPage />} />
              </>
            )}

            {/* Supplier Routes */}
            {user.role === "Supplier" && user.accountNo && (
              <>
                <Route path="/" element={<HomePageSupplier />} />
                <Route path="/create-product" element={<CreateProductPage />} />
              </>
            )}

            {/* Common Routes */}
            {(user.role === "Customer" || user?.role === "E-commerce" || user?.role === "Supplier") &&
              user.accountNo && <Route path="/account-info" element={<BankAccountPage />} />}

            {/* E-commerce and Supplier Routes */}
            {(user.role === "E-commerce" || user?.role === "Supplier") && user.accountNo && (
              <Route path="/products" element={<ProductsPage />} />
            )}

            <Route path="/" element={<h1>Page Not Found</h1>} />
          </Route>
          {/* Page Layout Route Ends Here */}

          {/* Payment Routes */}
          {user.role === "Customer" && user.accountNo && (
            <>
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment/success" element={<Success />} />
              <Route path="/payment/failure" element={<Failure />} />
            </>
          )}

          {/* Bank Routes */}
          <Route
            path="/add-money/:id"
            element={user.role === "Bank" ? <AddMoneyPage /> : <Navigate to="/" replace />}
          />

          {/* Billing Routes */}
          {user.role !== "Bank" && !user.accountNo && <Route path="/billing-info" element={<BillingInfoPage />} />}
        </>
      )}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
