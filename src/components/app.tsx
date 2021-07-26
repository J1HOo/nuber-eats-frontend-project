import { useReactiveVar } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "../apollo";
import { Restaurants } from "../pages/client/restaurants";
import { LoggedInRouter } from "../router/logged-in-router";
import { LoggedOutRouter } from "../router/logged-out-router";

export const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};