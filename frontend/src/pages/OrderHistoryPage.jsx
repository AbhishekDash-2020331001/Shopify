import { useEffect, useState } from "react";
import { getOrderHistory } from "../utils/apiCalls";
import { OrderHistoryItem } from "../components/OrderHistoryItem";
import { EmptyOrderHistory } from "../components/EmptyOrderHistory";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

export const OrderHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [orderHistory, setOrderHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const statusOrder = ["Pending", "Approved Unpaid", "Approved Paid", "Shipping", "Delivered"];

    const fetchOrderHistory = async () => {
      const { data, error } = await getOrderHistory();
      data.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
      setOrderHistory(data);
      setError(error);
      setLoading(false);
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (orderHistory.length === 0) {
    return <EmptyOrderHistory />;
  }

  return (
    <div className="flex-column w-full p-6 space-y-6">
      {orderHistory.map((order) => (
        <OrderHistoryItem key={order._id} {...order} />
      ))}
    </div>
  );
};
