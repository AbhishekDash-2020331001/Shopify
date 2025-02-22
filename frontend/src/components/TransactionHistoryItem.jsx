import { formattedDate } from "../utils/formattedDate";
import PropTypes from "prop-types";
import { Receipt, Package, ArrowRight, Calendar, DollarSign } from "lucide-react";

export const TransactionHistoryItem = ({ _id: id, orderId, from, to, amount, at }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 transition-all hover:border-gray-600">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative space-y-6">
        {/* Transaction ID and Order ID */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gray-400" />
            <p className="text-lg text-gray-400">
              Transaction ID: <span className="font-medium text-white">{id}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-400" />
            <p className="text-lg text-gray-400">
              Order ID: <span className="font-medium text-white">{orderId}</span>
            </p>
          </div>
        </div>

        {/* Transaction Flow */}
        <div className="flex items-center justify-between gap-4 px-4">
          <div className="flex-1">
            <p className="text-lg text-gray-400">
              From: <span className="font-medium text-white">{from}</span>
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
          <div className="flex-1 text-right">
            <p className="text-lg text-gray-400">
              To: <span className="font-medium text-white">{to}</span>
            </p>
          </div>
        </div>

        {/* Amount and Date */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <p className="text-lg text-gray-400">
              Date: <span className="font-medium text-white">{formattedDate(at)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <p className="text-lg text-gray-400">
              Amount: <span className="font-medium text-green-500">&#x09F3;{amount.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

TransactionHistoryItem.propTypes = {
  _id: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  at: PropTypes.string.isRequired,
};
