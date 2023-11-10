import React from "react";
import gmailImage from "../../assets/gmail.png";

const RequestSent = () => {
  return (
    <section className="requestSent">
      <h1>Password reset request sent</h1>
      <p>Check your email for resetting your password</p>
      <img src={gmailImage} alt="gmail logo" />
    </section>
  );
};

export default RequestSent;
