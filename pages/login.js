import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import LogIn from "../components/pages-menu/login";
import { useRouter } from "next/router";

const index = () => {
  const access = window.localStorage.getItem("access");
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
