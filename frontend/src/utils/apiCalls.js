import { axios } from "./axiosInstance";
import { formattedError } from "./formattedError";

const addBillingInfo = async ({ accountNo, accountSecret }) => {
  try {
    const response = await axios.post("/user/billing-info", { accountNo, accountSecret });
    return { data: response.data.data, error: null };
  } catch (error) {
    console.log("Error while adding billing info:", error);
    return { data: {}, error: formattedError(error) };
  }

}

const getProducts = async () => {
  try {
    const response = await axios.get("/user/products");
    return {data: response.data.data, error: null };
  } catch (error) {
    console.log("Error while getting products:", error);
    const err = formattedError(error);
    return { data: [], error: err };
  }
};

const getAccountInfo = async () => {
  try {
    const response = await axios.get("/user/account-info");
    return {data: response.data.data, error: null};
  } catch (error) {
    console.log("Error while getting account info:", error);
    const err = formattedError(error);
    return { data: {}, error: err };
  }
}

const getOrderHistory = async () => {
  try {
    const response = await axios.get("/customer/order-history");
    return {data: response.data.data, error: null};
  } catch (error) {
    console.log("Error while getting order history:", error);
    const err = formattedError(error);
    return { data: [], error: err };
  }
};

const getBankAccounts = async () => {
  try {
    const response = await axios.get("/bank/accounts");
    return { data: response.data.data, error: null };
  } catch (error) {
    console.log("Error while getting bank accounts:", error);
    const err = formattedError(error);
    return { data: [], error: err };
  }
}

const getTransactionRequests = async () => {
  try {
    const response = await axios.get("/bank/transaction-requests");
    return { data: response.data.data, error: null }
  } catch (error) {
    console.log("Error while getting transaction requests:", error);
    const err = formattedError(error);
    return { data: [], error: err };
  }
}

const approveTransactionRequest = async ({ transactionId }) => {
  try {
    const response = await axios.post("/bank/approve-transaction", { transactionId });
    return response.data.data;
  } catch (error) {
    console.log("Error while approving transaction request:", error);
    return {};
  }
}

const getTransactionHistory = async () => {
  try {
    const response = await axios.get("/bank/transaction-history");
    return { data: response.data.data, error: null };
  } catch (error) {
    console.log("Error while getting transaction history:", error);
    const err = formattedError(error);
    return { data: [], error: err };
  }
}

const addMoney = async ({ accountNo, amount, accountSecret }) => {
  try {
    const response = await axios.post("/bank/add-money", { accountNo, amount, accountSecret });
    return {data: response.data.data, error: null };
  } catch (error) {
    console.log("Error while adding money:", error);
    const err = formattedError(error);
    return { data: {}, error: err };
  }
}

const createBankAccount = async ({ accountNo, balance, accountSecret }) => {
  try {
    const response = await axios.post("/bank/create-account", { accountNo, balance, accountSecret });
    return { data: response.data.data, error: null }
  } catch (error) {
    const err = formattedError(error);
    return { data: {}, error: err };
  }
}

const getOrderRequests = async () => {
  try {
    const response = await axios.get("/e-commerce/order-requests");
    return {data: response.data.data, error: null};
  } catch (error) {
    console.log("Error while getting order requests:", error);
    const err = formattedError(error);
    return { data: [], error: err };
  }
}

const approveOrderRequest = async (orderId) => {
  try {
    const response = await axios.post("/e-commerce/approve-order", { orderId });
    return response.data.data;
  } catch (error) {
    console.log("Error while approving order request:", error);
    return {};
  }
}

const getSupplyRequests = async () => {
  try {
    const response = await axios.get("/supplier/supply-requests");
    return {data: response.data.data, error: null};
  } catch (error) {
    console.log("Error while getting supply requests:", error);
    const err = formattedError(error);
    return { data: [], error: err };
  }
}

const approveSupplyRequest = async (orderId) => {
  try {
    const response = await axios.post("/supplier/approve-supply", { orderId });
    return response.data.data;
  } catch (error) {
    console.log("Error while approving supply request:", error);
    return {};
  }
}

const createProduct = async ({ name, price, description, imageUrl }) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('imageUrl', imageUrl);
    const response = await axios.post("/supplier/create-product", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return { data: response.data.data, error: null };
  } catch (error) {
    console.log("Error while creating product:", error);
    const err = formattedError(error);
    return { data: {}, error: err };
  }
}

const getDeliveryRequests = async () => {
  try {
    const response = await axios.get("/e-commerce/delivery-requests");
    return {data: response.data.data, error: null};
  } catch (error) {
    console.log("Error while getting delivery requests:", error);
    const err = formattedError(error);
    return { data: [], error: err };
  }
}

const approveDeliveryRequest = async (orderId) => {
  try {
    const response = await axios.post("/e-commerce/approve-delivery", { orderId });
    return response.data.data;
  } catch (error) {
    console.log("Error while approving delivery request:", error);
    return {};
  }
}

export { addBillingInfo, getProducts, getOrderHistory, getAccountInfo, getTransactionRequests, approveTransactionRequest, getTransactionHistory, getBankAccounts, addMoney, createBankAccount, getOrderRequests, approveOrderRequest, getSupplyRequests, approveSupplyRequest, createProduct, getDeliveryRequests, approveDeliveryRequest };