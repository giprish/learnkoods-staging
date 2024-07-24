import { UserAuth } from "@/context/AuthContext";
import $ from "jquery";
import { toast } from "react-toastify";

const LoginWithSocial = ({ hideModal }) => {
  const { user, googleSignin, logout } = UserAuth();

  const handleSignin = async () => {
    console.log("handle signin clicked");
    try {
      await googleSignin();
      hideModal();
      toast.success("user logged in successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="btn-box row">
      <div className="col-lg-6 col-md-12">
        <a href="#" className="theme-btn social-btn-two facebook-btn">
          <i className="fab fa-facebook-f"></i> Log In via Facebook
        </a>
      </div>
      <div className="col-lg-6 col-md-12">
        <a
          className="theme-btn social-btn-two google-btn"
          onClick={handleSignin}
        >
          <i className="fab fa-google"></i> Log In via Gmail
        </a>
      </div>
    </div>
  );
};

export default LoginWithSocial;
