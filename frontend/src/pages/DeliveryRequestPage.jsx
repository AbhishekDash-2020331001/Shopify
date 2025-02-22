import { useEffect, useState } from "react";
import { getDeliveryRequests } from "../utils/apiCalls";
import { DeliveryRequestItem } from "../components/DeliveryRequestItem";
import { EmptyDeliveryRequest } from "../components/EmptyDeliveryRequest";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

export const DeliveryRequestPage = () => {
  const [loading, setLoading] = useState(true);
  const [deliveryRequests, setDeliveryRequests] = useState([]);
  const [error, setError] = useState(null);

  const fetchDeliveryRequests = async () => {
    const {data, error} = await getDeliveryRequests();
    setDeliveryRequests(data);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeliveryRequests();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (deliveryRequests.length === 0) {
    return <EmptyDeliveryRequest />;
  }

  return (
    <div className="flex-column">
      {deliveryRequests.map((deliveryRequest) => (
        <DeliveryRequestItem
          key={deliveryRequest.orderId}
          {...deliveryRequest}
          fetchDeliveryRequests={fetchDeliveryRequests}
          setLoading={setLoading}
        />
      ))}
    </div>
  );
};
