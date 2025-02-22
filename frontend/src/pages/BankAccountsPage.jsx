import { useState, useEffect } from "react";
import { getBankAccounts } from "../utils/apiCalls";
import { BankAccountItem } from "../components/BankAccountItem";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { EmptyBankAccounts } from "../components/EmptyBankAccounts";
import { Building2, Plus, RefreshCw, Search } from "lucide-react";
import { Link } from "react-router-dom";

export const BankAccountsPage = () => {
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchBankAccounts = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await getBankAccounts();
      if (error) {
        setError(error);
      } else {
        setBankAccounts(data || []);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const filteredAccounts = bankAccounts.filter(account => {
    if (!account) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (account.accountName?.toLowerCase() || "").includes(searchLower) ||
      (account.accountNo?.toLowerCase() || "").includes(searchLower)
    );
  });

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;
  if (!bankAccounts?.length) return <EmptyBankAccounts />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Building2 className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Bank Accounts</h1>
              <p className="text-base font-medium text-gray-300">Manage your linked bank accounts</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-300" />
              </div>
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg
                  text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-transparent transition-all duration-200 text-base font-medium"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchBankAccounts}
                disabled={refreshing}
                className="flex items-center gap-2 px-5 py-3 bg-gray-800/50 hover:bg-gray-700/50
                  border border-gray-600 rounded-lg text-gray-200 transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-base font-medium
                  disabled:cursor-not-allowed hover:border-gray-500"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <Link
                to="/create-bank-account"
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700
                  rounded-lg text-white transition-colors duration-200 text-base font-medium
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                <Plus className="h-5 w-5" />
                Add Account
              </Link>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-10 bg-gray-800/50 rounded-lg border border-gray-600">
              <Search className="h-14 w-14 text-gray-400 mb-5" />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">No accounts found</h3>
              <p className="text-base text-gray-300 text-center font-medium max-w-md">
                {searchQuery 
                  ? "Try adjusting your search terms or clear the search"
                  : "No bank accounts available at the moment"}
              </p>
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <BankAccountItem key={account?._id || account?.accountNo} {...account} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
