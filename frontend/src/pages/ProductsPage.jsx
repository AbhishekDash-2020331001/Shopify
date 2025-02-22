import { useEffect, useState } from "react";
import { getProducts } from "../utils/apiCalls";
import { ViewProduct } from "../components/ViewProduct";
import { EmptyProduct } from "../components/EmptyProduct";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { Package } from "lucide-react";

export const ProductsPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const {data, error} = await getProducts();
      setProducts(data);
      setError(error);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (products.length === 0) {
    return <EmptyProduct />;
  }

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10">
        <Package className="w-10 h-10 text-blue-500" />
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
            Your Products
          </h1>
          <p className="text-lg text-gray-400 mt-2">Manage and view your product catalog</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product) => (
          <ViewProduct key={product._id} {...product} />
        ))}
      </div>
    </div>
  );
};
