import { useEffect, useState } from "react";
import { getTransactionRequests } from "../utils/apiCalls";
import { TransactionRequestItem } from "../components/TransactionRequestItem";
import { EmptyTransactionRequest } from "../components/EmptyTransactionRequest";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

export const HomePageBank = () => {

  const [loading, setLoading] = useState(true)
  const [transactionRequests, setTransactionRequests] = useState([]);
  const [error, setError] = useState(null);

  const fetchTransactionRequests = async () => {
    const {data, error} = await getTransactionRequests();

    setTransactionRequests(data);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactionRequests();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (transactionRequests.length === 0) {
    return <EmptyTransactionRequest />;
  }

  return (
    <div className="grid">
      {transactionRequests.map((transactionRequest) => (
        <TransactionRequestItem
          key={transactionRequest._id}
          {...transactionRequest}
          fetchTransactionRequests={fetchTransactionRequests}
          setLoading={setLoading}
        />
      ))}
    </div>
  );
};
