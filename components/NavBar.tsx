import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <nav className=" bg-blue-400 w-100">
      <ul className="flex gap-10 px-4 py-6">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link href={"/about"}>About</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
