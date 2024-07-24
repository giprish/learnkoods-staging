import { useRouter } from "next/router";
import Link from "next/link";

const CheckLink = ({ href, children, checkUserPermissions }) => {
  const router = useRouter();
  const hasPermission = checkUserPermissions(href);

  const handleClick = (e) => {
    if (!hasPermission) {
      e.preventDefault();
      router.push("/"); // or any other page you want to redirect unauthorized users to
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default CheckLink;
