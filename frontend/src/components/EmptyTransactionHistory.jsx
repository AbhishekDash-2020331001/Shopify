import { Receipt, ArrowRight } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const EmptyTransactionHistory = () => {

  return (
    <EmptyState
      icon={Receipt}
      title="No Transaction History"
      description="Your transaction history is empty. Complete your first transaction to see it appear here."
      linkTo="/add-money"
      linkText={
        <>
          Add Money
          <ArrowRight className="w-5 h-5 ml-2" />
        </>
      }
      gradientColors={["from-violet-500/20", "via-purple-500/20", "to-fuchsia-500/20"]}
    />
  );
};
