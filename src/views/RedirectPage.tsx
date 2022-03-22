import React from "react";
import { Navigate } from "react-router";

/**
 * If the user is logged in, go to dashboard
 * else go to the login page
 */
function RedirectPage() {
  const route = document.cookie.includes('auth=') ? "/dashboard" : "/login";
  return <Navigate to={route} />
}

export default RedirectPage;