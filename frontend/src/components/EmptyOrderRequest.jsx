import { PackageSearch, RefreshCw } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const EmptyOrderRequest = () => {
  return (
    <EmptyState
      icon={PackageSearch}
      title="No Order Requests"
      description="There are no pending order requests at the moment. New requests will appear here when customers place orders."
      linkTo="/order-requests"
      linkText={
        <>
          <RefreshCw className="w-5 h-5 mr-2" />
          Check Again
        </>
      }
      gradientColors={["from-orange-500/20", "via-amber-500/20", "to-yellow-500/20"]}
    />
  );
};
