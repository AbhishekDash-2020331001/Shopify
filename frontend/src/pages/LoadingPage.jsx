import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const LoadingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6 p-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-16 w-16 text-blue-500" strokeWidth={1.5} />
        </motion.div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Loading</h2>
          <p className="text-lg font-medium text-gray-300">Please wait while we fetch your data...</p>
        </div>
      </motion.div>
    </div>
  );
};
