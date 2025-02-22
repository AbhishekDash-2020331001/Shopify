import { Trash2, Plus, Minus, Package2 } from "lucide-react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addToCart } from "../reducers/orderSlice";

export const CartItem = ({ id, name, description, imageUrl, price, quantity }) => {
  const dispatch = useDispatch();

  const formattedDescription = description.length > 100 ? `${description.slice(0, 100)}...` : description;

  const handleIncrementClick = () => {
    dispatch(addToCart({ productId: id, quantity: 1 }));
  };

  const handleDecrementClick = () => {
    dispatch(addToCart({ productId: id, quantity: -1 }));
  };

  const handleDeleteClick = () => {
    dispatch(addToCart({ productId: id, quantity: -quantity }));
  };

  return (
    <div className="group relative flex gap-6 rounded-xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-5
      hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 shadow-lg hover:shadow-gray-900/50">
      {/* Product Image */}
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 to-black/30 group-hover:opacity-0 transition-opacity duration-300" />
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-800">
            <Package2 className="h-10 w-10 text-gray-600" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors duration-300">
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-400 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300">
              {formattedDescription}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-lg font-semibold text-green-500 group-hover:text-green-400 transition-colors duration-300">
              &#x09F3;{price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">
              Total: &#x09F3;{(price * quantity).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center">
            <button
              onClick={handleDecrementClick}
              disabled={quantity <= 1}
              className="rounded-l-lg p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 
                disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <div className="w-14 flex items-center justify-center border-t border-b border-gray-700 py-2 px-3
              bg-gray-800/30 text-white font-medium">
              {quantity}
            </div>
            
            <button
              onClick={handleIncrementClick}
              className="rounded-r-lg p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 
                border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            className="rounded-lg p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 
              focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            title="Remove from cart"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

CartItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
};
