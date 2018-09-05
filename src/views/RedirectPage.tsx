import React from "react";
import { Redirect } from "react-router";

/**
 * If the user is logged in, go to dashboard 
 * else go to the login page
 */
function RedirectPage() {
  const route = document.cookie.includes('auth=') ? "/dashboard" : "/login";
  return <Redirect to={route} />
}

export default RedirectPage;