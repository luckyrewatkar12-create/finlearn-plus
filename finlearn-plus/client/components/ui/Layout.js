import Navbar from "./Navbar";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(99,102,241,0.3)",
          },
        }}
      />
    </div>
  );
}
