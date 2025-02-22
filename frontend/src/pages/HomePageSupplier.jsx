import { useEffect, useState } from "react";
import { getSupplyRequests } from "../utils/apiCalls";
import { SupplyRequestItem } from "../components/SupplyRequestItem";
import { EmptySupplyRequest } from "../components/EmptySupplyRequest";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

export const HomePageSupplier = () => {
  const [loading, setLoading] = useState(true);
  const [supplyRequests, setSupplyRequests] = useState([]);
  const [error, setError] = useState(null);

  const fetchSupplyRequest = async () => {
    const {data, error} = await getSupplyRequests();
    setSupplyRequests(data);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchSupplyRequest();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (supplyRequests.length === 0) {
    return <EmptySupplyRequest />;
  }

  return (
    <div className="grid">
      {supplyRequests.map((request) => (
        <SupplyRequestItem
          key={request.orderId}
          {...request}
          fetchSupplyRequest={fetchSupplyRequest}
          setLoading={setLoading}
        />
      ))}
    </div>
  );
};
