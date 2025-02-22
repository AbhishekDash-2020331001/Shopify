import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { addMoney } from "../utils/apiCalls";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { Wallet, CreditCard, DollarSign, Lock, ArrowRight, Building2 } from "lucide-react";

export const AddMoneyPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { accountName, accountNo, balance } = location.state || {};
  const navigate = useNavigate();

  const [formStates, setFormStates] = useState({
    amount: "",
    accountSecret: "",
    amountError: "",
    accountSecretError: "",
  });

  const [submittedOnce, setSubmittedOnce] = useState(false);

  const formInputs = [
    {
      type: "number",
      name: "amount",
      field: "Amount",
      placeholder: "Enter Amount",
      value: formStates.amount,
      error: submittedOnce ? formStates.amountError : "",
      icon: DollarSign,
    },
    {
      type: "password",
      name: "accountSecret",
      field: "Account Secret",
      placeholder: "Enter Account Secret",
      value: formStates.accountSecret,
      error: submittedOnce ? formStates.accountSecretError : "",
      icon: Lock,
    },
  ];

  const validateAmount = (amount) => {
    if (!amount) return "Amount is required";
    if (amount <= 0 || isNaN(amount)) return "Amount must be greater than 0";
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
        amountError: name === "amount" ? validateAmount(value) : prevState.amountError,
        accountSecretError: name === "accountSecret" ? validateAccountSecret(value) : prevState.accountSecretError,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    const amountError = validateAmount(formStates.amount);
    const accountSecretError = validateAccountSecret(formStates.accountSecret);

    if (amountError || accountSecretError) {
      setFormStates((prevState) => ({
        ...prevState,
        amountError,
        accountSecretError,
      }));
      return;
    }

    setLoading(true);
    const { data, error } = await addMoney({
      accountNo,
      amount: formStates.amount,
      accountSecret: formStates.accountSecret,
    });
    setError(error);
    setLoading(false);

    if (data?._id) {
      navigate("/bank-accounts", { replace: true });
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;
  if (!accountName || !accountNo || !balance) return <Navigate to="/bank-accounts" replace />;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Wallet className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Add Money</h2>
          <p className="mt-2 text-sm text-gray-400">Add funds to your bank account securely</p>
        </div>

        {/* Account Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="text-sm font-medium text-white">{accountName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Account No</p>
                <p className="text-sm font-medium text-white">{accountNo}</p>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Current Balance</p>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-lg font-bold text-green-500">&#x09F3;{balance.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {formInputs.map((input) => (
              <div key={input.name}>
                <label htmlFor={input.name} className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                  <input.icon className="w-4 h-4" />
                  {input.field}
                </label>
                <div className="relative">
                  <input
                    type={input.type}
                    name={input.name}
                    id={input.name}
                    placeholder={input.placeholder}
                    autoComplete="off"
                    value={input.value}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border ${
                      input.error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-600 focus:border-gray-500"
                    } focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors`}
                  />
                  {input.error && (
                    <p className="mt-2 text-sm text-red-500">{input.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={formInputs.some((input) => input.error)}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg
              text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2
              focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed
              transition-colors duration-200"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <ArrowRight className="h-5 w-5 text-green-500 group-hover:text-green-400" aria-hidden="true" />
            </span>
            Add Money
          </button>
        </form>
      </div>
    </div>
  );
};
