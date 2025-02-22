import { useEffect, useState } from "react";
import { getTransactionHistory } from "../utils/apiCalls";
import { TransactionHistoryItem } from "../components/TransactionHistoryItem";
import { EmptyTransactionHistory } from "../components/EmptyTransactionHistory";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

export const TransactionHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransactionHistory() {
      const { data, error } = await getTransactionHistory();
      data.sort((a, b) => {
        const millisecondsA = new Date(a.createdAt).getTime();
        const millisecondsB = new Date(b.createdAt).getTime();
        return millisecondsB - millisecondsA;
      });
      setTransactionHistory(data);
      setError(error);
      setLoading(false);
    }

    fetchTransactionHistory();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (transactionHistory.length === 0) {
    return <EmptyTransactionHistory />;
  }

  return (
    <div className="flex-column">
      {transactionHistory.map((transaction) => (
        <TransactionHistoryItem key={transaction._id} {...transaction} />
      ))}
    </div>
  );
};
