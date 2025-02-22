import { WalletCards, RefreshCw } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const EmptyTransactionRequest = () => {
  return (
    <EmptyState
      icon={WalletCards}
      title="No Transaction Requests"
      description="There are no pending transaction requests at the moment. New requests will appear here when users initiate transactions."
      linkTo="/transaction-requests"
      linkText={
        <>
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh List
        </>
      }
      gradientColors={["from-lime-500/20", "via-green-500/20", "to-emerald-500/20"]}
    />
  );
};
