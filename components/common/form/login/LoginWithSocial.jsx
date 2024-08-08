import { UserAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const LoginWithSocial = ({ hideModal }) => {
  const { googleSignin, loading } = UserAuth();

  const handleSignin = async () => {
    console.log("handle signin clicked");
    try {
      googleSignin();
      hideModal();
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
          disabled={loading}
        >
          <i className="fab fa-google"></i> Log In via Gmail
        </a>
      </div>
    </div>
  );
};

export default LoginWithSocial;
