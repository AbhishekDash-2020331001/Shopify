import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { signup } from "../../reducers/authSlice";
import { User, Mail, Lock, Building2, ShoppingCart, Truck, Landmark } from "lucide-react";

export const SignupPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const userRoles = {
    customer: "Customer",
    eCommerce: "E-commerce",
    supplier: "Supplier",
    bank: "Bank",
  };

  const roleIcons = {
    [userRoles.customer]: <ShoppingCart className="w-5 h-5" />,
    [userRoles.eCommerce]: <Building2 className="w-5 h-5" />,
    [userRoles.supplier]: <Truck className="w-5 h-5" />,
    [userRoles.bank]: <Landmark className="w-5 h-5" />,
  };

  const [formStates, setFormStates] = useState({
    role: userRoles.customer,
    name: "",
    email: "",
    password: "",
    nameError: "",
    emailError: "",
    passwordError: "",
  });

  const [submittedOnce, setSubmittedOnce] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const formInputs = [
    {
      type: "text",
      name: "name",
      field: "Full Name",
      placeholder: "Enter your full name",
      value: formStates.name,
      error: submittedOnce ? formStates.nameError : "",
      icon: <User className="w-5 h-5 text-gray-400" />,
    },
    {
      type: "email",
      name: "email",
      field: "Email",
      placeholder: "Enter your email",
      value: formStates.email,
      error: submittedOnce ? formStates.emailError : "",
      icon: <Mail className="w-5 h-5 text-gray-400" />,
    },
    {
      type: "password",
      name: "password",
      field: "Password",
      placeholder: "Enter your password",
      value: formStates.password,
      error: submittedOnce ? formStates.passwordError : "",
      icon: <Lock className="w-5 h-5 text-gray-400" />,
    },
  ];

  const validateName = (name) => {
    if (!name) return "Full name is required";
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Invalid email";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must contain at least 6 characters";
    return "";
  };

  const handleRoleClick = (role) => {
    setFormStates((prevState) => ({
      ...prevState,
      role,
    }));
  };

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
        nameError: name === "name" ? validateName(value) : prevState.nameError,
        emailError: name === "email" ? validateEmail(value) : prevState.emailError,
        passwordError: name === "password" ? validatePassword(value) : prevState.passwordError,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedOnce(true);

    // Validate inputs before submission
    const nameError = validateName(formStates.name);
    const emailError = validateEmail(formStates.email);
    const passwordError = validatePassword(formStates.password);

    if (nameError || emailError || passwordError) {
      setFormStates((prevState) => ({
        ...prevState,
        nameError,
        emailError,
        passwordError,
      }));
      return; // Stop form submission if validation fails
    }

    dispatch(
      signup({
        name: formStates.name,
        email: formStates.email,
        password: formStates.password,
        role: formStates.role,
      }),
    );
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl border border-gray-700">
        <div>
          <img className="mx-auto h-16 w-auto rounded-lg" src="/commercac.png" alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(userRoles).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleClick(userRoles[role])}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${
                  formStates.role === userRoles[role]
                    ? 'border-green-500 bg-green-500/10 text-green-500'
                    : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                } transition-all duration-200`}
              >
                {roleIcons[userRoles[role]]}
                {userRoles[role]}
              </button>
            ))}
          </div>

          {/* Input Fields */}
          <div className="space-y-4">
            {formInputs.map((input) => (
              <div key={input.name}>
                <label htmlFor={input.name} className="block text-sm font-medium text-gray-300">
                  {input.field}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {input.icon}
                  </div>
                  <input
                    type={input.type}
                    name={input.name}
                    id={input.name}
                    placeholder={input.placeholder}
                    autoComplete="off"
                    value={input.value}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      input.error ? 'border-red-500' : 'border-gray-600'
                    } rounded-md bg-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  />
                  {input.error && (
                    <p className="mt-1 text-sm text-red-500">{input.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={formInputs.some((input) => input.error)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Sign up
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" replace className="font-medium text-green-500 hover:text-green-400">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
