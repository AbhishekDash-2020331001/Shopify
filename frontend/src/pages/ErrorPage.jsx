import { AlertCircle, RefreshCw } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export const ErrorPage = ({ error, onRetry }) => {
  const errorMessage = error?.message || "Something went wrong. Please try again.";
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <div className="relative rounded-2xl border border-gray-800 bg-gradient-to-b from-red-500/10 to-orange-500/10 p-8 shadow-2xl shadow-red-900/20 backdrop-blur-xl">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-red-500/20 blur-lg" />
              <AlertCircle className="relative h-20 w-20 text-red-500" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl font-bold text-red-500">Error</h2>
            <p className="text-lg font-medium text-gray-300">{errorMessage}</p>
          </motion.div>

          {/* Retry Button */}
          {onRetry && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <button
                onClick={onRetry}
                className="group flex w-full items-center justify-center gap-3 rounded-xl
                  bg-gradient-to-br from-red-500 to-orange-600 px-6 py-3.5
                  text-lg font-semibold text-white shadow-lg shadow-red-900/25
                  transition-all hover:from-red-600 hover:to-orange-700
                  hover:shadow-xl hover:shadow-red-900/30
                  focus:outline-none focus:ring-2 focus:ring-red-500
                  focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <RefreshCw className="h-6 w-6 transition-transform group-hover:rotate-180" />
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

ErrorPage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func,
};
