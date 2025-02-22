import { XCircle, RotateCcw } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCart } from "../reducers/orderSlice";

export const Failure = ({ title, description, linkText, linkTo }) => {
  const { error } = useSelector((state) => state.order);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!error) {
      navigate("/", { replace: true });
    }
  }, [error, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getCart());
    navigate("/", { replace: true });
  };

  const displayTitle = title || "Payment Failed";
  const displayDescription = description || (error?.statusText || "We couldn't process your payment. Please check your account secret and try again.");
  const displayLinkText = linkText || "Try Again";
  const displayLinkTo = linkTo || "/payment";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="flex min-h-[400px] w-full items-center justify-center px-8"
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-gray-800 bg-gradient-to-b from-red-500/10 to-rose-500/10 p-8 shadow-2xl shadow-red-900/20 backdrop-blur-xl">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent" />
        
        {/* Failure Icon with Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-red-500/20 blur-lg" />
            <XCircle className="relative h-16 w-16 text-red-500" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <h2 className="text-xl font-medium text-red-500">{displayTitle}</h2>
          <p className="mt-2 text-sm text-gray-400">{displayDescription}</p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Link
            to={displayLinkTo}
            onClick={handleSubmit}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-900/25 transition-all hover:from-red-600 hover:to-rose-700 hover:shadow-xl hover:shadow-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-12" />
            {displayLinkText}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

Failure.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  linkText: PropTypes.string,
  linkTo: PropTypes.string,
};
