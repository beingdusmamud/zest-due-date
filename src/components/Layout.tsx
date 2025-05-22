
import { ReactNode } from "react";
import NavBar from "./NavBar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";
  
  // Don't show the NavBar on the auth page
  const showNavBar = !isAuthPage;
  
  return (
    <>
      {showNavBar && <NavBar />}
      <main className={showNavBar ? "pt-16" : ""}>{children}</main>
    </>
  );
}

export default Layout;
