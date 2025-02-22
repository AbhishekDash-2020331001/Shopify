import { useEffect, useState } from "react";
import { getProducts } from "../utils/apiCalls";
import { Product } from "../components/Product";
import { useDispatch } from "react-redux";
import { getCart } from "../reducers/orderSlice";
import { EmptyProduct } from "../components/EmptyProduct";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";
import { Search } from "lucide-react";

export const HomePageCustomer = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await getProducts();
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Available Products</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[300px] pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-400">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Product key={product._id} {...product} setLoading={setLoading} />
          ))}
        </div>
      )}
    </div>
  );
};
