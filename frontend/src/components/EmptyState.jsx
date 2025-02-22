import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

export const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  linkTo,
  linkText,
  customIcon,
  gradientColors = ["from-blue-500/20", "to-green-500/20"]
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 max-w-md mx-auto p-8"
      >
        <div className="relative mx-auto">
          {/* Animated gradient background */}
          <div className={`absolute inset-0 blur-3xl bg-gradient-to-r ${gradientColors.join(' ')} animate-pulse`} />
          
          {/* Icon container with glass effect */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-xl 
              hover:shadow-blue-500/10 transition-shadow duration-300"
          >
            {customIcon || (
              <Icon className="w-24 h-24 text-blue-500 mx-auto" strokeWidth={1.5} />
            )}
          </motion.div>
        </div>

        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-white tracking-tight">{title}</h3>
          {description && (
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
              {description}
            </p>
          )}
        </div>

        {linkTo && linkText && (
          <div>
            <Link
              to={linkTo}
              replace
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent 
                rounded-xl text-base font-medium text-white bg-blue-600 hover:bg-blue-700
                transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {linkText}
            </Link>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  linkTo: PropTypes.string,
  linkText: PropTypes.node,
  customIcon: PropTypes.node,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
};
