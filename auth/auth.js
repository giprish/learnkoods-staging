"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { UserAuth } from "@/context/AuthContext";

const ACCESS_TOKEN_SECRET = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET;

const withAuth = (WrappedComponent, skipRoutes) => {
  return (props) => {
    const router = useRouter();
    const { user, loading } = UserAuth();
    const [isRefreshing, setIsRefreshing] = useState(false); // Track token refresh state

    const verifyToken = useCallback(async () => {
      const accessToken = window.localStorage.getItem("access");
      const refreshToken = window.localStorage.getItem("refresh");
      const student = window.localStorage.getItem("student");
      const currentRoute = router.pathname;

      if (skipRoutes.includes(currentRoute)) {
        console.log("Auth exiting early");
        return;
      }

      if (!accessToken || !refreshToken) {
        router.push("/");
        return;
      }

      try {
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        console.log("Access token is valid");

        if (
          student === "true" &&
          currentRoute.startsWith("/employers-dashboard")
        ) {
          router.push("/");
          return;
        }

        if (
          student === "false" &&
          currentRoute.startsWith("/candidates-dashboard")
        ) {
          router.push("/");
          return;
        }
      } catch (error) {
        console.log("Access token is invalid or expired", error);

        if (isRefreshing) return; // Prevent multiple refresh attempts

        setIsRefreshing(true);

        try {
          const res = await fetch(
            `${process.env.GLOBAL_API}/api/token/refresh/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          );

          if (res.ok) {
            const { access: newAccessToken } = await res.json();
            window.localStorage.setItem("access", newAccessToken);
            console.log("Token refreshed successfully");

            if (
              student === "true" &&
              currentRoute.startsWith("/employers-dashboard")
            ) {
              router.push("/");
              return;
            }

            if (
              student === "false" &&
              currentRoute.startsWith("/candidates-dashboard")
            ) {
              router.push("/");
              return;
            }
          } else {
            throw new Error("Failed to refresh token");
          }
        } catch (refreshError) {
          console.log("Error during token refresh", refreshError);
          router.push("/");
        } finally {
          setIsRefreshing(false); // Reset the refreshing flag after the process completes
        }
      }
    }, [router.pathname, isRefreshing]);

    useEffect(() => {
      verifyToken();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
