import { User } from "../models/user.model.js";

const getFormattedOrderDetails = (order, products) => {
  const formattedOrderDetails = { ...order._doc, products: {} };
  products.forEach((product) => {
    formattedOrderDetails.products[product.id] = {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      description: product.description,
      price: product.price,
      quantity: order.products.get(product.id)
    };
  });
  return formattedOrderDetails;
}

const getFormattedOrderRequests = async (orderRequests) => {

  const formattedOrderRequests = [];
  for (const orderRequest of orderRequests) {
    const customer = await User.findById(orderRequest.from);

    if (!customer) {
      continue;
    }

    const formattedOrderRequest = {
      orderId: orderRequest._id,
      customerName: customer.name,
      customerEmail: customer.email,
      amount: orderRequest.amount,
    };

    formattedOrderRequests.push(formattedOrderRequest);
  }

  return formattedOrderRequests;
}

export { getFormattedOrderRequests, getFormattedOrderDetails };