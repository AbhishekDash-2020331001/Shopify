import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addToCart } from "../reducers/orderSlice";
import { ShoppingCart, Package2 } from "lucide-react";

export const Product = ({ _id: id, name, price, imageUrl, description, setLoading }) => {
  const dispatch = useDispatch();

  const formattedDescription = description.length > 100 ? `${description.slice(0, 100)}...` : description;

  const handleAddToCartButtonClick = () => {
    setLoading(true);
    dispatch(addToCart({ productId: id, quantity: 1 }));
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50 
      backdrop-blur-sm transition-all duration-300 hover:border-gray-600 hover:bg-gray-800/70 
      hover:shadow-lg hover:shadow-gray-900/50">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-black/30 
          group-hover:opacity-0 transition-opacity duration-300 z-10" />
        
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover transition-transform duration-500 
              group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-800">
            <Package2 className="h-16 w-16 text-gray-700" />
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute inset-x-0 bottom-0 h-full flex items-center justify-center 
          bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent opacity-0 
          group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="flex gap-3 transform translate-y-8 group-hover:translate-y-0 
            transition-transform duration-300">
            <button
              onClick={handleAddToCartButtonClick}
              className="p-3 rounded-xl bg-green-600/90 text-white hover:bg-green-700 
                transform hover:scale-105 transition-all duration-200 focus:outline-none 
                focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-medium text-white line-clamp-1 group-hover:text-blue-400 
              transition-colors duration-300">
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300 
              transition-colors duration-300">
              {formattedDescription}
            </p>
          </div>
          <p className="text-lg font-semibold text-green-500 group-hover:text-green-400 
            transition-colors duration-300">
            &#x09F3;{price.toLocaleString()}
          </p>
        </div>

        {/* Mobile Add to Cart Button */}
        <button
          onClick={handleAddToCartButtonClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 
            bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg 
            hover:from-green-700 hover:to-green-600 transform hover:scale-[1.02] 
            transition-all duration-200 focus:outline-none focus:ring-2 
            focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900
            md:hidden"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

Product.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  description: PropTypes.string.isRequired,
  setLoading: PropTypes.func.isRequired,
};
