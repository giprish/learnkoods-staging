import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Aos from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/index.scss";
import ScrollToTop from "../components/common/ScrollTop";
import { ToastContainer } from "react-toastify";
import { persistor, store } from "../app/store.js";
import withAuth from "../auth/auth";
import { AuthContextProvider } from "@/context/AuthContext";
import Head from "next/head";

// Conditional import for Bootstrap JavaScript
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap");
}

// Initialize QueryClient for react-query
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  // Initialize AOS for animations
  useEffect(() => {
    Aos.init({
      duration: 1400,
      once: true,
    });
  }, []);

  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Head></Head>
          <div className="page-wrapper">
            <Component {...pageProps} />

            {/* Toastify for notifications */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            {/* Scroll To Top Button */}
            <ScrollToTop />
          </div>
        </Provider>
      </QueryClientProvider>
    </AuthContextProvider>
  );
}

// Routes that skip authentication
const skipRoutes = [
  "/job-list/job-list-v1",
  "/job-single-v1/[id]",
  "/login",
  "/register",
  "/password-reset-confirm/[uidb64]/[token]",
  "/upskill",
  "/assessment",
  "/assessment/code-editor",
  "/pricing",
  "/",
  "/payment",
  "/assessment",
  "/assessment/problems/[id]",
];

export default withAuth(MyApp, skipRoutes);
