import React, { useEffect } from "react";

import { Outlet } from "react-router-dom";
import Signup from "./src/signin/Signup";
const Layout = () => {
  return (
    <>
      <Outlet />
      <Signup />
    </>
  );
};

export default Layout;
