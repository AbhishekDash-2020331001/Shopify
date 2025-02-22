import { useState } from "react";
import { createBankAccount } from "../utils/apiCalls";
import { LoadingPage } from "./LoadingPage";
import { BankAccountItem } from "../components/BankAccountItem";
import { ErrorPage } from "./ErrorPage";
import { ArrowLeft, Building2, CreditCard, KeyRound, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const CreateBankAccountPage = () => {
  const [loading, setLoading] = useState(false);
  const [bankAccount, setBankAccount] = useState({});
  const [error, setError] = useState(null);

  const [formStates, setFormStates] = useState({
    accountNo: "",
    balance: "",
    accountSecret: "",
    accountNoError: "",
    balanceError: "",
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
      type: "number",
      name: "balance",
      field: "Bank Balance",
      placeholder: "Enter Initial Balance",
      value: formStates.balance,
      error: submittedOnce ? formStates.balanceError : "",
      icon: <Wallet className="h-5 w-5 text-gray-400" />,
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

  const validateBalance = (balance) => {
    if (!balance) return "Amount is required";
    if (balance <= 0 || isNaN(balance)) return "Amount must be greater than 0";
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
        balanceError: name === "balance" ? validateBalance(value) : prevState.balanceError,
        accountSecretError: name === "accountSecret" ? validateAccountSecret(value) : prevState.accountSecretError,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    // Validate inputs before submission
    const accountNoError = validateAccountNo(formStates.accountNo);
    const balanceError = validateBalance(formStates.balance);
    const accountSecretError = validateAccountSecret(formStates.accountSecret);

    if (accountNoError || balanceError || accountSecretError) {
      setFormStates((prevState) => ({
        ...prevState,
        accountNoError,
        balanceError,
        accountSecretError,
      }));
      return; // Stop form submission if validation fails
    }

    // Call the createBankAccount function
    setLoading(true);
    const { data, error } = await createBankAccount({
      accountNo: formStates.accountNo,
      balance: formStates.balance,
      accountSecret: formStates.accountSecret,
    });
    setBankAccount(data);
    setError(error);
    setLoading(false);
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/bank-accounts"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Bank Accounts</span>
          </Link>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl" />
          <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl overflow-hidden p-8">
            {/* Form Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Building2 className="h-7 w-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create Bank Account</h1>
                <p className="text-gray-400">Link your bank account to start using our services</p>
              </div>
            </div>

            {/* Form */}
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

              <button
                type="submit"
                disabled={formInputs.some((input) => input.error)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4
                  bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg
                  hover:from-blue-700 hover:to-blue-600 transform hover:scale-[1.02]
                  transition-all duration-200 focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  text-base font-medium"
              >
                Create Account
              </button>
            </form>
          </div>
        </motion.div>

        {/* Show Created Bank Account */}
        {bankAccount?._id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-8"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white">Account Created Successfully!</h2>
              <p className="text-gray-400">Here are your account details:</p>
            </div>
            <BankAccountItem {...bankAccount} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
