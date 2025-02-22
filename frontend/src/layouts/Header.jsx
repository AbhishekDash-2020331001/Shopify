import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/authSlice";
import { ShoppingCart, LogOut, Package, Building2, History, Truck, PlusSquare } from "lucide-react";
import { LoadingPage } from "../pages/LoadingPage";
import { ErrorPage } from "../pages/ErrorPage";

export const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.order);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} from="Header" />;
  }

  const handleClick = () => {
    dispatch(logout());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Shopify" className="h-12 w-12" />
          <div className="flex flex-col">
            <span className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 text-transparent bg-clip-text tracking-tight">
              Shopify
            </span>
            <span className="text-sm text-gray-400 -mt-1">Your Premium Marketplace</span>
          </div>
        </Link>
        
        <nav className="flex items-center gap-8">
          {user.role === "Customer" ? (
            <>
              <Link to="/order-history" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <History className="w-6 h-6" />
                Orders
              </Link>
              <Link to="/account-info" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
                Bank Account
              </Link>
              <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors">
                <ShoppingCart className="w-7 h-7" />
                {cart.products && Object.keys(cart.products).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center">
                    {Object.keys(cart.products).length}
                  </span>
                )}
              </Link>
            </>
          ) : user.role === "E-commerce" ? (
            <>
              <Link to="/delivery-requests" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <Truck className="w-6 h-6" />
                Delivery
              </Link>
              <Link to="/account-info" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
                Bank Account
              </Link>
              <Link to="/products" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <Package className="w-6 h-6" />
                Products
              </Link>
            </>
          ) : user.role === "Bank" ? (
            <>
              <Link to="/bank-accounts" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
                Accounts
              </Link>
              <Link to="/transaction-history" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <History className="w-6 h-6" />
                Transactions
              </Link>
            </>
          ) : user.role === "Supplier" ? (
            <>
              <Link to="/products" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <Package className="w-6 h-6" />
                Products
              </Link>
              <Link to="/supply-requests" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <Truck className="w-6 h-6" />
                Supply Requests
              </Link>
              <Link to="/account-info" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <Building2 className="w-6 h-6" />
                Bank Account
              </Link>
              <Link to="/create-product" className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors">
                <PlusSquare className="w-6 h-6" />
                Create Product
              </Link>
            </>
          ) : null}
          <button
            onClick={handleClick}
            className="flex items-center gap-2 text-lg text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="w-6 h-6" />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};
