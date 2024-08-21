"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { UserAuth } from "@/context/AuthContext";

const ACCESS_TOKEN_SECRET = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET;

const withAuth = (WrappedComponent, skipRoutes) => {
  return (props) => {
    const router = useRouter();
    const { user, loading } = UserAuth();

    const verifyToken = useCallback(async () => {
      // if (loading) {
      //   console.log("loading true");
      //   return;
      // } // Wait for the loading to finish/

      const accessToken = window.localStorage.getItem("access");
      const refreshToken = window.localStorage.getItem("refresh");
      const student = window.localStorage.getItem("student");
      const currentRoute = router.pathname;
      // console.log(currentRoute);

      if (skipRoutes.includes(currentRoute)) {
        console.log("auth exiting early");
        return;
      }

      if (!accessToken || !refreshToken) {
        // If either access token or refresh token is missing, redirect to login
        // console.log("User is not authenticated or tokens are missing");
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
          console.log("Student cannot access employer dashboard");
          router.push("/");
          return;
        }

        if (
          student === "false" &&
          currentRoute.startsWith("/candidates-dashboard")
        ) {
          console.log("Employer cannot access candidates dashboard");
          router.push("/");
          return;
        }
      } catch (error) {
        console.log("Access token is invalid or expired", error);
        if (
          student === "true" &&
          currentRoute.startsWith("/employers-dashboard")
        ) {
          console.log("Student cannot access employer dashboard");
          router.push("/");
          return;
        }

        if (
          student === "false" &&
          currentRoute.startsWith("/candidates-dashboard")
        ) {
          console.log("Employer cannot access candidates dashboard");
          router.push("/");
          return;
        }

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
              currentRoute.startsWith("/employer-dashboard")
            ) {
              console.log("Student cannot access employer dashboard");
              router.push("/");
              return;
            }

            if (
              student === "false" &&
              currentRoute.startsWith("/candidates-dashboard")
            ) {
              console.log("Employer cannot access candidates dashboard");
              router.push("/");
              return;
            }
          } else {
            console.log("Failed to refresh token");
            throw new Error("Failed to refresh token");
          }
        } catch (refreshError) {
          console.log("Error during token refresh", refreshError);
          router.push("/");
          if (
            student === "true" &&
            currentRoute.startsWith("/employers-dashboard")
          ) {
            console.log("Student cannot access employer dashboard");
            router.push("/");
            return;
          }

          if (
            student === "false" &&
            currentRoute.startsWith("/candidates-dashboard")
          ) {
            console.log("Employer cannot access candidates dashboard");
            router.push("/");
            return;
          }
        }
      }
    }, [router.pathname]);

    useEffect(() => {
      verifyToken();
    }, [verifyToken]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
