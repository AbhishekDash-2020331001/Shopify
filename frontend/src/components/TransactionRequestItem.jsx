import PropTypes from "prop-types";
import { approveTransactionRequest } from "../utils/apiCalls";
import { Receipt, ArrowRight, DollarSign, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedButton } from "./AnimatedPage";

export const TransactionRequestItem = ({ _id: id, orderId, from, to, amount, fetchTransactionRequests, setLoading }) => {
  const handleClick = async () => {
    try {
      setLoading(true);
      await approveTransactionRequest({ transactionId: id });
      await fetchTransactionRequests();
    } catch (error) {
      console.log("Error while approving transaction request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative overflow-hidden rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm p-6 transition-all hover:border-gray-600"
    >
      {/* Background Gradient Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
      />

      {/* Content */}
      <div className="relative space-y-6">
        {/* Order ID */}
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Receipt className="w-5 h-5 text-gray-400" />
            <p className="text-lg text-gray-400">
              Transaction ID: <span className="font-medium text-white">{orderId}</span>
            </p>
          </motion.div>
          <AnimatedButton
            onClick={handleClick}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Approve</span>
          </AnimatedButton>
        </div>

        {/* Transaction Flow */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex items-center justify-between gap-4 px-4"
        >
          <div className="flex-1">
            <p className="text-lg text-gray-400">
              From: <span className="font-medium text-white">{from}</span>
            </p>
          </div>
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
          </motion.div>
          <div className="flex-1 text-right">
            <p className="text-lg text-gray-400">
              To: <span className="font-medium text-white">{to}</span>
            </p>
          </div>
        </motion.div>

        {/* Amount */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="flex items-center gap-2 pt-4 border-t border-gray-700"
        >
          <DollarSign className="w-4 h-4 text-gray-400" />
          <p className="text-lg text-gray-400">
            Amount: <span className="font-medium text-green-500">&#x09F3;{amount}</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

TransactionRequestItem.propTypes = {
  _id: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  fetchTransactionRequests: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};
