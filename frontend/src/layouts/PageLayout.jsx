import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export const PageLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};
