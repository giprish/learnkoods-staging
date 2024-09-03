"use client";

// import { useEffect, useCallback, useState } from "react";
// import { useRouter } from "next/router";
// import jwt from "jsonwebtoken";
// import { UserAuth } from "@/context/AuthContext";
// import LoadingSpinner from "@/components/loader";

// const ACCESS_TOKEN_SECRET = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET;

// const withAuth = (WrappedComponent, skipRoutes) => {
//   return (props) => {
//     const router = useRouter();
//     const { user, loading: authLoading } = UserAuth();
//     const [isRefreshing, setIsRefreshing] = useState(false); // Track token refresh state
//     const [loading, setLoading] = useState(false); // Track the overall loading state

//     const verifyToken = useCallback(async () => {
//       setLoading(true);
//       const accessToken = window.localStorage.getItem("access");
//       const refreshToken = window.localStorage.getItem("refresh");
//       const student = window.localStorage.getItem("student");
//       const currentRoute = router.pathname;

//       if (skipRoutes.includes(currentRoute)) {
//         console.log("Auth exiting early");
//         setLoading(false); // No need to show loader if skipping auth check
//         return;
//       }

//       if (!accessToken || !refreshToken) {
//         router.push("/");
//         setLoading(false);
//         return;
//       }

//       try {
//         jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
//         console.log("Access token is valid");

//         if (
//           student === "true" &&
//           currentRoute.startsWith("/employers-dashboard")
//         ) {
//           router.push("/");
//           setLoading(false);
//           return;
//         }

//         if (
//           student === "false" &&
//           currentRoute.startsWith("/candidates-dashboard")
//         ) {
//           router.push("/");
//           setLoading(false);
//           return;
//         }
//       } catch (error) {
//         console.log("Access token is invalid or expired", error);

//         if (isRefreshing) return; // Prevent multiple refresh attempts

//         setIsRefreshing(true);

//         try {
//           const res = await fetch(
//             `${process.env.GLOBAL_API}/api/token/refresh/`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({ refresh: refreshToken }),
//             }
//           );

//           if (res.ok) {
//             const { access: newAccessToken } = await res.json();
//             window.localStorage.setItem("access", newAccessToken);
//             console.log("Token refreshed successfully");

//             if (
//               student === "true" &&
//               currentRoute.startsWith("/employers-dashboard")
//             ) {
//               router.push("/");
//               return;
//             }

//             if (
//               student === "false" &&
//               currentRoute.startsWith("/candidates-dashboard")
//             ) {
//               router.push("/");
//               return;
//             }
//           } else {
//             throw new Error("Failed to refresh token");
//           }
//         } catch (refreshError) {
//           console.log("Error during token refresh", refreshError);
//           router.push("/");
//         } finally {
//           setIsRefreshing(false); // Reset the refreshing flag after the process completes
//           setLoading(false);
//         }
//       }

//       // Once the token is verified or the user is redirected, hide the loader
//       setLoading(false);
//     }, [router.pathname, isRefreshing]);

//     useEffect(() => {
//       verifyToken();
//     }, []);

//     if (loading || authLoading) {
//       // Render a loader while the authentication checks are in progress
//       return <LoadingSpinner />; // Replace with your preferred loader component
//     }

//     // Render the wrapped component when loading is complete
//     return <WrappedComponent {...props} />;
//   };
// };

// export default withAuth;

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import axios from "axios";
import LoadingSpinner from "@/components/loader";

const withAuth = (WrappedComponent, skipRoutes) => {
  const AuthHOC = (props) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuthentication = async () => {
        try {
          // Check if the current route is in the skipRoutes array
          if (skipRoutes.includes(router.pathname)) {
            setLoading(false);
            return;
          }

          // Check if access token is present in localStorage
          const token = localStorage.getItem("access");
          const refreshToken = localStorage.getItem("refresh");

          if (!token) {
            // No token found, check if the current route is a skip route
            if (skipRoutes.includes(router.pathname)) {
              setLoading(false);
              return;
            }

            // If not a skip route, clear localStorage and redirect to login
            localStorage.clear();
            router.replace("/login");
            return;
          }

          // Verify token to check expiration and validity
          try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
          } catch (error) {
            // Token is invalid or expired
            console.log(error, "token error");
            // Handle different errors
            if (error.name === "TokenExpiredError") {
              // Token expired, try to refresh the token
              if (refreshToken) {
                try {
                  // Make an API call to refresh the token
                  const response = await axios.post(
                    `${process.env.GLOBAL_API}/api/token/refresh/`,
                    { refresh: refreshToken }
                  );
                  const newAccessToken = response.data.accessToken;

                  // Store the new access token in localStorage
                  localStorage.setItem("access", newAccessToken);

                  // Continue with the authentication check
                  setLoading(false);
                  return;
                } catch (refreshError) {
                  // Refresh token failed, clear storage and redirect to login
                  localStorage.clear();
                  router.replace("/login");
                  return;
                }
              } else {
                // No refresh token available, clear storage and redirect to login
                localStorage.clear();
                router.replace("/login");
                return;
              }
            } else if (
              error.name === "JsonWebTokenError" ||
              error.name === "NotBeforeError"
            ) {
              // Token is invalid or being used before it's allowed
              localStorage.clear();
              router.replace("/login");
              return;
            } else {
              // Handle any other unexpected errors
              localStorage.clear();
              router.replace("/login");
              return;
            }
          }

          // Check if the 'student' key exists in localStorage
          const student = localStorage.getItem("student");

          // Redirect to login if student is not defined
          if (!student) {
            router.replace("/");
            setLoading(false);
            return;
          }

          // Check for access restrictions based on student value
          const isStudent = student === "true";
          const currentPath = router.pathname;
          console.log(isStudent, "isstudent");
          console.log(currentPath, "current path");

          // Restrict access for students to /employers-dashboard routes
          if (isStudent && currentPath.startsWith("/employers-dashboard")) {
            router.replace("/"); // Redirect to a not-authorized page
            return;
          }

          // Restrict access for non-students to /students-dashboard routes
          if (!isStudent && currentPath.startsWith("/candidates-dashboard")) {
            router.replace("/"); // Redirect to a not-authorized page
            return;
          }

          // If all conditions are satisfied, allow access to the page
          setLoading(false);
        } catch (error) {
          // In case of any errors (e.g., decoding failure), logout and redirect to login
          localStorage.clear();
          router.replace("/");
        }
      };

      checkAuthentication();
    }, [router]);

    // Show loading text while authentication checks are ongoing
    if (loading) {
      return <LoadingSpinner />;
    }

    // Render the wrapped component (the protected page content) once authentication is confirmed
    return <WrappedComponent {...props} />;
  };

  return AuthHOC;
};

export default withAuth;
