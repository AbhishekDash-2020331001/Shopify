import { useState } from "react";
import { addBillingInfo } from "../../utils/apiCalls";
import { useDispatch } from "react-redux";
import { getUser, logout } from "../../reducers/authSlice";
import { LoadingPage } from "../LoadingPage";
import { ErrorPage } from "../ErrorPage";
import { Building2, CreditCard, KeyRound, LogOut, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export const BillingInfoPage = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formStates, setFormStates] = useState({
    accountNo: "",
    accountSecret: "",
    accountNoError: "",
    accountSecretError: "",
  });

  const [submittedOnce, setSubmittedOnce] = useState(false);

  const formInputs = [
    {
      type: "text",
      name: "accountNo",
      field: "Account No",
      placeholder: "Enter 12-digit Account Number",
      value: formStates.accountNo,
      error: submittedOnce ? formStates.accountNoError : "",
      icon: <CreditCard className="h-5 w-5 text-gray-400" />,
    },
    {
      type: "password",
      name: "accountSecret",
      field: "Account Secret",
      placeholder: "Enter Account Secret (min. 6 characters)",
      value: formStates.accountSecret,
      error: submittedOnce ? formStates.accountSecretError : "",
      icon: <KeyRound className="h-5 w-5 text-gray-400" />,
    },
  ];

  const validateAccountNo = (accountNo) => {
    if (!accountNo) return "Account Number is required";
    if (!/^\d{12}$/.test(accountNo)) return "Account Number must contain exactly 12 digits";
    return "";
  };

  const validateAccountSecret = (accountSecret) => {
    if (!accountSecret) return "Account secret is required";
    if (accountSecret.length < 6) return "Account secret must contain at least 6 characters";
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
        accountNoError: name === "accountNo" ? validateAccountNo(value) : prevState.accountNoError,
        accountSecretError: name === "accountSecret" ? validateAccountSecret(value) : prevState.accountSecretError,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    // Validate the inputs before submitting
    const accountNoError = validateAccountNo(formStates.accountNo);
    const accountSecretError = validateAccountSecret(formStates.accountSecret);

    if (accountNoError || accountSecretError) {
      setFormStates((prevState) => ({
        ...prevState,
        accountNoError,
        accountSecretError,
      }));
      return; // Stop form submission if validation fails
    }

    // Proceed with API call if validation is passed
    setLoading(true);
    const { error } = await addBillingInfo({
      accountNo: formStates.accountNo,
      accountSecret: formStates.accountSecret,
    });

    setError(error);
    setLoading(false);

    if (!error) {
      dispatch(getUser());
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 ring-1 ring-blue-500/50">
            <Building2 className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Billing Information
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Link your bank account to start using our services
          </p>
        </div>

        {/* Alert */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-3"
        >
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-300">
            Please add your billing information to proceed further
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl" />
          <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl overflow-hidden p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formInputs.map((input) => (
                <div key={input.name}>
                  <label htmlFor={input.name} className="block text-sm font-medium text-gray-300 mb-2">
                    {input.field}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {input.icon}
                    </div>
                    <input
                      type={input.type}
                      name={input.name}
                      id={input.name}
                      placeholder={input.placeholder}
                      autoComplete="off"
                      value={input.value}
                      onChange={handleInputChange}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-800/50 border ${
                        input.error ? "border-red-500" : "border-gray-600"
                      } rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                        focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                    />
                  </div>
                  {input.error && (
                    <p className="mt-2 text-sm text-red-500">{input.error}</p>
                  )}
                </div>
              ))}

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={formInputs.some((input) => input.error)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4
                    bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg
                    hover:from-blue-700 hover:to-blue-600 transform hover:scale-[1.02]
                    transition-all duration-200 focus:outline-none focus:ring-2
                    focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    text-base font-medium"
                >
                  Submit
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-3 px-6
                    bg-red-500/10 text-red-500 rounded-lg border border-red-500/20
                    hover:bg-red-500/20 transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-red-500
                    focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
