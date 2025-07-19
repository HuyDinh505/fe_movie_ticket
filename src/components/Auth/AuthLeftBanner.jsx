import React from "react";

const AuthLeftBanner = ({ image, children }) => (
  <div
    className="w-1/2 flex flex-col justify-center items-center"
    style={{ backgroundColor: "var(--color-primary)" }}
  >
    <img
      src={image}
      alt="movie"
      className="w-full h-full object-cover shadow-lg"
    />
    {children}
  </div>
);

export default AuthLeftBanner;
