import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo">
        You've got 4 tasks today
      </Link>
      <div className="header__sub-menu">
        <Link to="/login">로그인</Link>
        <Link to="/posts">게시글</Link>
        <Link to="/profile">프로필</Link>
      </div>
    </header>
  );
}
