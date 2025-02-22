# Commercac

***Commercac*** is a simulation system designed to model the interaction between three key entities in an e-commerce ecosystem: the e-commerce organization, a product supplier, and a bank. The project aims to demonstrate the flow of transactions between these entities, providing a functional simulation of e-commerce operations, from product selection to transaction processing and order fulfillment.

## How to run this project
<pre>
<strong>Clone the project:</strong> Use one of these three way to clone this project
  <em>HTTPS:</em> https://github.com/imusshas/ECommerce.git
  <em>SSH:</em> git@github.com:imusshas/ECommerce.git
  <em>Github CLI:</em> gh repo clone imusshas/ECommerce

Or download the .zip file and unzip it

<strong>Backend:</strong> Open a terminal and type -
  cd ECommerce
  npm install
  npm run dev

<strong>Frontend:</strong> Open another terminal and type -
  cd ECommerce/frontend
  npm install
  npm run dev
</pre>

## Key Features:
1. **E-Commerce Organization:** The e-commerce platform sells a limited selection of products. It facilitates product browsing, order placement, and transaction processing with the bank.
2. **Product Supplier:** The supplier provides the products requested by the e-commerce organization, only after the required payment is successfully processed by the bank.
3. **Bank:** The bank handles financial transactions, facilitating payments from users to the e-commerce organization and ensuring the supplier receives the required funds.

## Project Workflow:
1. **User Interaction:**
- Users register in to the e-commerce platform and set up their bank account information, including a secret used for secure transactions.
- After logging in, they can browse the available products and select the ones they wish to purchase.
2. **Transaction Flow:**
- Once products are ordered, the system calculates the total price and sends a order request to the e-commerce organization via a transaction through the bank.
- Upon successful transaction, the e-commerce organization generates a record, which is then sent to the bank to transfer fund to the supplier for product delivery.
3. **Supplier Interaction:**
- The supplier receives the supply request from the e-commerce organization, validates the transaction via the bank, and receives payment once confirmed.
4. **Final Step:**
- After the supplier receives the payment, they confirm the order fulfillment to the e-commerce organization.
- The user is notified of the successful order delivery, and the system updates its information accordingly.

## Core Functionality:
- **User Account Management:** The user must input bank details and maintain their transaction security.
- **Product Selection & Purchase:** Users can browse and select products, placing them into an order.
- **Transaction Processing:** The e-commerce organization sends payment requests to the bank, which processes the payments securely.
- **Supplier Notification:** Upon successful payment, the supplier is notified and can validate the transaction to receive payment.
- **Balance Management:** All entities can retrieve and manage their respective balances through API interactions.

## API Integration:
The interactions between the e-commerce organization, the bank, and the supplier are all handled through their respective web APIs. These APIs ensure the communication is seamless, and each entity is aware of the status of the transactions at all times.

## Technologies Used
### **Frontend:**
- React (Vite)
- JavaScript
- Redux Toolkit
### **Backend:**
- Express
- MongoDB
- Mongoose
- NodeJS v23.5.0

## Future Scope
- **Responsiveness:** The app is not responsive across multiple screens. Desktop first approach was used to build this application.
- **Animations:** No animation library was used to build this project.
- **Theming:** This app comes with only light theme.
- **Payment Gateway:** As the bank resides withing the ecosystem, no gateway is used for the bank transactions.