import PropTypes from "prop-types";
import { formattedDate } from "../utils/formattedDate";
import { Package, Calendar, DollarSign, Clock } from "lucide-react";

const getStatusStyles = (status) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium";
  const statusType = status.split(" ")[0].toLowerCase();

  switch (statusType) {
    case "pending":
      return `${baseStyles} bg-yellow-500/10 text-yellow-500`;
    case "processing":
      return `${baseStyles} bg-blue-500/10 text-blue-500`;
    case "delivered":
      return `${baseStyles} bg-green-500/10 text-green-500`;
    case "cancelled":
      return `${baseStyles} bg-red-500/10 text-red-500`;
    default:
      return `${baseStyles} bg-gray-500/10 text-gray-500`;
  }
};

export const OrderHistoryItem = ({ _id: id, createdAt, amount, status }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 transition-all hover:border-gray-600">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative space-y-4">
        {/* Order ID and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" />
            <p className="text-lg text-gray-400">
              Order ID: <span className="font-medium text-white">{id}</span>
            </p>
          </div>
          <span className={getStatusStyles(status)}>
            <Clock className="w-3 h-3" />
            {status.split(" ")[0]}
          </span>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <p className="text-lg text-gray-400">
              Order Date: <span className="font-medium text-white">{formattedDate(createdAt)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <p className="text-lg text-gray-400">
              Amount: <span className="font-medium text-green-500">&#x09F3;{amount.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderHistoryItem.propTypes = {
  _id: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  amount: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
};
