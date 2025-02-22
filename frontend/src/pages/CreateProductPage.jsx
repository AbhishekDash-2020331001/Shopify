import { useState } from "react";
import { ImageUp, Package, DollarSign, FileText, Plus } from "lucide-react";
import { createProduct } from "../utils/apiCalls";
import { ViewProduct } from "../components/ViewProduct";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

export const CreateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);

  const [formStates, setFormStates] = useState({
    imageUrl: "",
    name: "",
    price: "",
    description: "",
    imageUrlError: "",
    nameError: "",
    priceError: "",
    descriptionError: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [submittedOnce, setSubmittedOnce] = useState(false);

  // Create functions for validation
  const validateImageUrl = (imageUrl) => {
    if (!imageUrl) return "Product image is required";
    return "";
  };
  const validateName = (name) => {
    if (!name) return "Product name is required";
    return "";
  };

  const validatePrice = (price) => {
    if (!price) return "Product price is required";
    if (price <= 0 || isNaN(price)) return "Price must be greater than 0";
    return "";
  };

  const validateDescription = (description) => {
    if (!description) return "Product description is required";
    return "";
  };

  // Handle image change (upload)
  const handleImageChange = (e) => {
    e.preventDefault();

    const { name, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      setFormStates((prevState) => ({
        ...prevState,
        imageUrl: file,
      }));

      if (submittedOnce) {
        const imageUrlError = name === "imageUrl" ? validateImageUrl(file) : "";
        setFormStates((prevState) => ({
          ...prevState,
          imageUrlError,
        }));
      }
    }
  };

  // Handle input field changes
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormStates((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (submittedOnce) {
      setFormStates((prevState) => ({
        ...prevState,
        nameError: name === "name" ? validateName(value) : "",
        priceError: name === "price" ? validatePrice(value) : "",
        descriptionError: name === "description" ? validateDescription(value) : "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    const imageUrlError = validateImageUrl(formStates.imageUrl);
    const nameError = validateName(formStates.name);
    const priceError = validatePrice(formStates.price);
    const descriptionError = validateDescription(formStates.description);

    if (imageUrlError || nameError || priceError || descriptionError) {
      setFormStates((prevState) => ({
        ...prevState,
        imageUrlError,
        nameError,
        priceError,
        descriptionError,
      }));
      return;
    }

    setLoading(true);
    const { data, error } = await createProduct({
      name: formStates.name,
      price: formStates.price,
      description: formStates.description,
      imageUrl: formStates.imageUrl,
    });
    setProduct(data);
    setError(error);
    setLoading(false);
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Create New Product</h1>
        <p className="text-gray-400">Fill in the details below to create a new product</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Upload Section */}
          <div className="space-y-4">
            <label
              htmlFor="imageUrl"
              className={`relative group block w-full aspect-square rounded-xl border-2 border-dashed transition-all duration-300 ${
                formStates.imageUrlError
                  ? "border-red-500 bg-red-500/5"
                  : "border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                name="imageUrl"
                id="imageUrl"
                className="hidden"
                onChange={handleImageChange}
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                {formStates.imageUrlError ? (
                  <>
                    <ImageUp className="w-12 h-12 text-red-500 mb-3" />
                    <p className="text-red-500 text-sm text-center">{formStates.imageUrlError}</p>
                  </>
                ) : imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <ImageUp className="w-12 h-12 text-gray-400 mb-3 group-hover:text-gray-300 transition-colors" />
                    <p className="text-gray-400 text-sm text-center group-hover:text-gray-300 transition-colors">
                      Click or drag image to upload
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Product Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Package className="w-4 h-4" />
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter product name"
                value={formStates.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border ${
                  formStates.nameError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:border-gray-500"
                } focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors`}
              />
              {formStates.nameError && (
                <p className="text-red-500 text-sm">{formStates.nameError}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label htmlFor="price" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <DollarSign className="w-4 h-4" />
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                placeholder="Enter price"
                value={formStates.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border ${
                  formStates.priceError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:border-gray-500"
                } focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors`}
              />
              {formStates.priceError && (
                <p className="text-red-500 text-sm">{formStates.priceError}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <FileText className="w-4 h-4" />
                Product Description
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="Enter product description"
                value={formStates.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border ${
                  formStates.descriptionError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-600 focus:border-gray-500"
                } focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none transition-colors resize-none`}
              />
              {formStates.descriptionError && (
                <p className="text-red-500 text-sm">{formStates.descriptionError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            formStates.imageUrlError ||
            formStates.nameError ||
            formStates.priceError ||
            formStates.descriptionError
          }
          className="w-full md:w-auto px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
          disabled:cursor-not-allowed text-white font-medium flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          Create Product
        </button>
      </form>

      {/* Success View */}
      {product?._id && (
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-green-500" />
            Product Created Successfully
          </h2>
          <ViewProduct {...product} />
        </div>
      )}
    </div>
  );
};
