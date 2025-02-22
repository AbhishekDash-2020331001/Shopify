import { useEffect, useState } from "react";
import { getOrderRequests } from "../utils/apiCalls";
import { OrderRequestItem } from "../components/OrderRequestItem";
import { EmptyOrderRequest } from "../components/EmptyOrderRequest";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

export const HomePageECommerce = () => {
  const [loading, setLoading] = useState(true);
  const [orderRequests, setOrderRequests] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrderRequests = async () => {
    const {data, error} = await getOrderRequests();
    setOrderRequests(data);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderRequests();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (orderRequests.length === 0) {
    return <EmptyOrderRequest />;
  }

  return (
    <div className="grid">
      {orderRequests.map((orderRequest) => (
        <OrderRequestItem
          key={orderRequest.orderId}
          {...orderRequest}
          fetchOrderRequests={fetchOrderRequests}
          setLoading={setLoading}
        />
      ))}
    </div>
  );
};
