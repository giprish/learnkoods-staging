import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import LogIn from "../components/pages-menu/login";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const index = () => {
  const [access, setAccess] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccess(window.localStorage.getItem("access"));
    }
  }, []);
  const router = useRouter();
  if (access) {
    router.push("/");
  }
  return (
    <>
      <Seo pageTitle="Login" />
      <LogIn />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
