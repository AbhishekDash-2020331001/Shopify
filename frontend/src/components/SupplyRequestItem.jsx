import PropTypes from "prop-types";
import { approveSupplyRequest } from "../utils/apiCalls";
import { Truck, User, Mail, DollarSign, CheckCircle } from "lucide-react";
import { useState } from "react";

export const SupplyRequestItem = ({ orderId, customerName, customerEmail, amount, fetchSupplyRequest, setLoading }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      await approveSupplyRequest(orderId);
      await fetchSupplyRequest();
    } catch (error) {
      console.log("Error while approving order request:", error);
    }
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 transition-all hover:border-gray-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative space-y-6">
        {/* Order ID */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-400" />
            <p className="text-lg text-gray-400">
              Supply Order ID: <span className="font-medium text-white">{orderId}</span>
            </p>
          </div>
          <button
            onClick={handleClick}
            className="relative group/btn flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200"
          >
            <CheckCircle className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`} />
            <span className="font-medium">Approve Supply</span>
          </button>
        </div>

        {/* Customer Details */}
        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-400" />
            <p className="text-lg text-gray-400">
              Customer: <span className="font-medium text-white">{customerName}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400" />
            <p className="text-lg text-gray-400">
              Email: <span className="font-medium text-white">{customerEmail}</span>
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <p className="text-lg text-gray-400">Supply Amount</p>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-bold text-blue-500">&#x09F3;{amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

SupplyRequestItem.propTypes = {
  orderId: PropTypes.string.isRequired,
  customerName: PropTypes.string.isRequired,
  customerEmail: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  fetchSupplyRequest: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
