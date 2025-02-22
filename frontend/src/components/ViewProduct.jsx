import PropTypes from "prop-types";
import { DollarSign, Package, FileText } from "lucide-react";

export const ViewProduct = ({ name, price, imageUrl, description }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex flex-col md:flex-row">
        {/* Image Container */}
        <div className="relative w-full md:w-2/5 aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Product Icon */}
          <div className="absolute top-4 right-4">
            <Package className="w-8 h-8 text-white/70" />
          </div>
        </div>

        {/* Content Container */}
        <div className="relative flex-1 p-8 flex flex-col justify-between">
          {/* Product Details */}
          <div className="space-y-4">
            {/* Title and Price */}
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-3xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                {name}
              </h3>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full">
                <DollarSign className="w-6 h-6 text-emerald-500" />
                <span className="text-2xl font-bold text-emerald-500">
                  &#x09F3;{price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
              <p className="text-base leading-relaxed text-gray-300">
                {description}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute bottom-8 right-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

ViewProduct.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
