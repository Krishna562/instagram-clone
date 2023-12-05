import { useEffect } from "react";
import gmailImage from "../../assets/gmail.png";
import {
  useNavigate,
  useParams,
  Link,
  useSearchParams,
} from "react-router-dom";
import axios from "../../axios/axios";

const RequestSent = () => {
  const actionType = useParams().actionType;
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  let title;
  let instructions;
  if (actionType === "resetPassword") {
    title = "Password reset request sent";
    instructions = "Check your email inbox for resetting your password";
  } else if (actionType === "signup") {
    title = "Email verification link sent";
    instructions = "Check your email inbox to verify your email";
  } else if (actionType === "emailVerified" || token) {
    title = "Email verification successful";
    instructions = "Now you can login with your verified email";
  } else {
    navigate("/login");
  }

  const isUserVerified = async () => {
    try {
      await axios.put(`/verify-email/${token}`);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (actionType === "emailVerified" && token) {
      isUserVerified();
    }
  }, []);

  return (
    <section className="requestSent">
      <h1>{title}</h1>
      <p>{instructions}</p>
      <img src={gmailImage} alt="gmail logo" />
      {actionType === "emailVerified" && (
        <Link to="/login" className="requestSent__link">
          Click here to go to the login page
        </Link>
      )}
    </section>
  );
};

export default RequestSent;
