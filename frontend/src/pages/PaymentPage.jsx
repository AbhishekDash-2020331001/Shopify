import { useState } from "react";
import { LoadingPage } from "./LoadingPage";
import { useDispatch, useSelector } from "react-redux";
import { makePayment } from "../reducers/orderSlice";
import { Navigate } from "react-router-dom";
import { Lock, CreditCard, Building, ShieldCheck, ArrowRight, Receipt, MapPin } from "lucide-react";

export const PaymentPage = () => {
  const { cart, transaction, loading, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [formStates, setFormStates] = useState({
    accountSecret: "",
    accountSecretError: "",
    location: "",
    locationError: "",
  });

  const input = {
    type: "password",
    name: "accountSecret",
    field: "Account Secret",
    placeholder: "Enter your account secret",
    value: formStates.accountSecret,
    error: submittedOnce ? formStates.accountSecretError : "",
    icon: Lock,
  };

  const locationInput = {
    type: "text",
    name: "location",
    field: "Delivery Location",
    placeholder: "Enter your delivery address",
    value: formStates.location,
    error: submittedOnce ? formStates.locationError : "",
    icon: MapPin,
  };

  const validateAccountSecret = (accountSecret) => {
    if (!accountSecret) return "Account secret is required";
    if (accountSecret.length < 6) return "Account secret must contain at least 6 characters";
    return "";
  };

  const validateLocation = (location) => {
    if (!location) return "Delivery location is required";
    return "";
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormStates((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (submittedOnce) {
      setFormStates((prevState) => ({
        ...prevState,
        [`${name}Error`]: name === "accountSecret" 
          ? validateAccountSecret(value)
          : validateLocation(value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    const accountSecretError = validateAccountSecret(formStates.accountSecret);
    const locationError = validateLocation(formStates.location);

    if (accountSecretError || locationError) {
      setFormStates((prevState) => ({
        ...prevState,
        accountSecretError,
        locationError,
      }));
      return;
    }

    dispatch(makePayment({ orderId: cart._id, accountSecret: formStates.accountSecret }));
  };

  if (loading) return <LoadingPage />;
  if (error) return <Navigate to="/payment/failure" replace />;
  if (transaction?._id) return <Navigate to="/payment/success" replace />;

  const renderInput = (inputConfig) => (
    <div>
      <label htmlFor={inputConfig.name} className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
        <inputConfig.icon className="w-4 h-4" />
        {inputConfig.field}
      </label>
      <div className="relative">
        <input
          type={inputConfig.type}
          name={inputConfig.name}
          id={inputConfig.name}
          placeholder={inputConfig.placeholder}
          autoComplete="off"
          value={inputConfig.value}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-lg bg-gray-700/50 border ${
            inputConfig.error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-600 focus:border-gray-500"
          } focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none transition-colors`}
        />
        {inputConfig.error && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            {inputConfig.error}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 ring-1 ring-green-500/50">
            <CreditCard className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Complete Payment
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Secure payment gateway for your transaction
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-xl space-y-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-medium text-white">Order Summary</h3>
              </div>
              <span className="px-3 py-1 text-xs font-medium text-green-500 bg-green-500/10 rounded-full">
                Pending Payment
              </span>
            </div>

            {/* Amount */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Total Amount</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">&#x09F3;{cart.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center px-4 py-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Payment Method</span>
              <div className="flex items-center gap-2 text-white">
                <Building className="w-4 h-4 text-green-500" />
                <span>Admin Bank</span>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-center gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <p className="text-sm text-blue-300">
              Your payment information is encrypted and secure
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderInput(input)}
            {renderInput(locationInput)}

            <button
              type="submit"
              disabled={formStates.accountSecretError || formStates.locationError}
              className="group relative w-full flex items-center justify-center px-4 py-3 border border-transparent 
                rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 
                disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-green-500 group-hover:text-green-400" />
              </span>
              Confirm Payment
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
