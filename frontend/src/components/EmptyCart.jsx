import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const EmptyCart = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="w-full max-w-lg"
      >
        <div className="relative rounded-2xl border border-gray-800 bg-gradient-to-b from-indigo-500/10 to-purple-500/10 p-8 shadow-2xl shadow-indigo-900/20 backdrop-blur-xl">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-indigo-500/20 blur-lg" />
              <ShoppingCart className="relative h-20 w-20 text-indigo-500" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl font-bold text-white">Your Cart is Empty</h2>
            <p className="text-lg font-medium text-gray-300">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it with amazing products!
            </p>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link
              to="/products"
              className="group flex w-full items-center justify-center gap-3 rounded-xl 
                bg-gradient-to-br from-indigo-500 to-purple-600 px-6 py-3.5
                text-lg font-semibold text-white shadow-lg shadow-indigo-900/25 
                transition-all hover:from-indigo-600 hover:to-purple-700 
                hover:shadow-xl hover:shadow-indigo-900/30 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Start Shopping
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
