import { LogIn } from "lucide-react";

function NavBar() {
  return (
    <nav className="w-[calc(100vw-80px)] pb-0 p-4 flex justify-between z-50">
      <h1 className="text-3xl txt font-bold">EduHaven</h1>
      <a
        href="/authenticate"
        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
        style={{ backgroundColor: "var(--btn)", color: "white" }}
      >
        <LogIn size={18} />
        <span>Login / Signup</span>
      </a>
    </nav>
  );
}

export default NavBar;
