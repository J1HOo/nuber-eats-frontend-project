import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <Helmet>
      <title>Not Found | Nuber Eats</title>
    </Helmet>
    <h2 className="font-semibold text-2xl mb-3">페이지를 찾을 수 없습니다.</h2>
    <h4 className="font-medium text-base mb-5">
      The page you're looking for does not exist or has moved.
    </h4>
    <Link className="hover:underline text-lime-600" to="/">
      메인페이지로 돌아가기 &rarr;
    </Link>
  </div>
);