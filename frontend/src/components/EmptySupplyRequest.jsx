import { Factory, RefreshCw } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const EmptySupplyRequest = () => {
  return (
    <EmptyState
      icon={Factory}
      title="No Supply Requests"
      description="There are no supply requests at the moment. Check back later for new inventory requests from our stores."
      linkTo="/supply-requests"
      linkText={
        <>
          <RefreshCw className="w-5 h-5 mr-2" />
          Check Requests
        </>
      }
      gradientColors={["from-cyan-500/20", "via-sky-500/20", "to-blue-500/20"]}
    />
  );
};
