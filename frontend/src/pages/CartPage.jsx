import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CartItem } from "../components/CartItem";
import { EmptyCart } from "../components/EmptyCart";
import { LoadingPage } from "./LoadingPage";
import { ShoppingBag, CreditCard } from "lucide-react";

export const CartPage = () => {
  const { loading, cart } = useSelector((state) => state.order);

  if (loading) {
    return <LoadingPage />;
  }
  
  if (Object.keys(cart.products).length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <ShoppingBag className="w-6 h-6 text-green-500" />
        <h1 className="text-2xl font-bold text-white">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {Object.values(cart.products).map((product) => (
            <CartItem key={product.id} {...product} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              {Object.values(cart.products).map((product) => {
                const totalPrice = product.price * product.quantity;
                return (
                  <div key={product.id} className="flex justify-between text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-400">{product.quantity}x</span>
                      <span className="ml-2 text-white">{product.name}</span>
                    </div>
                    <span className="text-white">&#x09F3;{totalPrice}</span>
                  </div>
                );
              })}
            </div>

            <div className="my-4 border-t border-gray-700" />
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-lg font-bold text-green-500">&#x09F3;{cart.amount}</span>
            </div>

            <Link
              to="/payment"
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
