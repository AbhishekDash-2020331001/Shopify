import { Building2, CreditCard, User } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export const BankAccountItem = ({ accountName, accountNo, bankName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity group-hover:opacity-100 opacity-0" />
      <div className="relative p-6 bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-600">
        {/* Bank Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Building2 className="h-7 w-7 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1">{bankName}</h3>
            <p className="text-base font-medium text-gray-300">Bank Account</p>
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          {/* Account Number */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <CreditCard className="h-5 w-5 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Account Number</p>
              <p className="text-base font-semibold text-gray-200">{accountNo}</p>
            </div>
          </div>

          {/* Account Name */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-700/50 rounded-lg">
              <User className="h-5 w-5 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Account Name</p>
              <p className="text-base font-semibold text-gray-200">{accountName}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

BankAccountItem.propTypes = {
  accountName: PropTypes.string.isRequired,
  accountNo: PropTypes.string.isRequired,
  bankName: PropTypes.string.isRequired,
};
