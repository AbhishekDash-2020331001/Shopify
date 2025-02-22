import { useEffect, useState } from "react";
import { getAccountInfo } from "../utils/apiCalls";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { motion } from "framer-motion";
import { Building2, CreditCard, Wallet } from "lucide-react";

export const BankAccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState({});
  const [error, setError] = useState(null);

  const { accountName, accountNo, balance } = accountInfo;

  useEffect(() => {
    const fetchAccountInfo = async () => {
      const { data, error } = await getAccountInfo();
      setAccountInfo(data);
      setError(error);
      setLoading(false);
    };

    fetchAccountInfo();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="w-full max-w-2xl"
      >
        <div className="relative rounded-2xl border border-gray-800 bg-gradient-to-b from-blue-500/10 to-purple-500/10 p-8 shadow-2xl shadow-blue-900/20 backdrop-blur-xl">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Bank Account</h1>
                <p className="text-lg text-gray-400">View your account details</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-6">
            {/* Account Name */}
            <div className="rounded-xl border border-gray-800/50 bg-gray-900/50 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <CreditCard className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Account Name</p>
                  <p className="text-xl font-bold text-white mt-1">{accountName}</p>
                </div>
              </div>
            </div>

            {/* Account Number */}
            <div className="rounded-xl border border-gray-800/50 bg-gray-900/50 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Account Number</p>
                  <p className="text-xl font-bold text-white mt-1">{accountNo}</p>
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="rounded-xl border border-gray-800/50 bg-gray-900/50 p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-500/10 p-3">
                  <Wallet className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Current Balance</p>
                  <p className="text-2xl font-bold text-green-500 mt-1">
                    &#x09F3;{balance?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
