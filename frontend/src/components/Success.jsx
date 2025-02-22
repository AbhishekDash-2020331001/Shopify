import { CheckCircle2, ArrowRight } from "lucide-react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../reducers/orderSlice";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../utils/formattedDate";

export const Success = ({ title, description, linkText, linkTo }) => {
  const { transaction } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const { _id: id, orderId, amount, at } = transaction;
  const navigate = useNavigate();

  const displayTitle = title || "Success!";
  const displayDescription = description || "Your action has been completed successfully.";
  const displayLinkText = linkText || "Continue";
  const displayLinkTo = linkTo || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(getCart());
    navigate("/", { replace: true });
  };

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
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-800 bg-gradient-to-b from-green-500/10 to-emerald-500/10 p-8 shadow-2xl shadow-green-900/20 backdrop-blur-xl">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
        
        {/* Success Icon with Animation */}
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
            <div className="absolute -inset-4 rounded-full bg-green-500/20 blur-lg" />
            <CheckCircle2 className="relative h-20 w-20 text-green-500" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center space-y-3"
        >
          <h2 className="text-3xl font-bold text-green-500">{displayTitle}</h2>
          <p className="text-lg font-medium text-gray-300">{displayDescription}</p>
          <p className="text-sm text-gray-400">
            Transaction ID: {id} <br />
            Order ID: {orderId} <br />
            Amount: &#x09F3;{amount} <br />
            Payment Method: Admin Bank <br />
            At: {formattedDate(at)}
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
            to={displayLinkTo}
            onClick={handleSubmit}
            className="group flex w-full items-center justify-center gap-3 rounded-xl 
              bg-gradient-to-br from-green-500 to-emerald-600 px-6 py-3.5 
              text-lg font-semibold text-white shadow-lg shadow-green-900/25 
              transition-all hover:from-green-600 hover:to-emerald-700 
              hover:shadow-xl hover:shadow-green-900/30 
              focus:outline-none focus:ring-2 focus:ring-green-500 
              focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {displayLinkText}
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

Success.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  linkText: PropTypes.string,
  linkTo: PropTypes.string,
};
