import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="pageNotFound">
      Sorry ! The page you're looking for doesn't exist.{" "}
      <Link to="/">Go back to instagram.</Link>
    </div>
  );
};

export default PageNotFound;
