import { Package2, Plus } from "lucide-react";
import { EmptyState } from "./EmptyState";

export const EmptyProduct = () => {
  return (
    <EmptyState
      icon={Package2}
      title="No Products Available"
      description="There are no products available at the moment. Add your first product to start selling on our platform."
      linkTo="/products/create"
      linkText={
        <>
          <Plus className="w-5 h-5 mr-2" />
          Add First Product
        </>
      }
      gradientColors={["from-pink-500/20", "via-rose-500/20", "to-red-500/20"]}
    />
  );
};
