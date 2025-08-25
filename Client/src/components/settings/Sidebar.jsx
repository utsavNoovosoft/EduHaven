import {
  CircleUser,
  CircleUserRound,
  GraduationCap,
  LogIn,
  LogOut,
  Palette,
  Settings2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmLogoutModal from "../ConfirmLogoutModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Sidebar = ({ user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const tabs = [
    { key: "basic-info", label: "Basic Info", icon: <CircleUser size={24} /> },
    {
      key: "edu-skills",
      label: "Education & Skills",
      icon: <GraduationCap size={24} />,
    },
    { key: "account", label: "Account", icon: <CircleUserRound size={24} /> },
    { key: "friends", label: "Friends", icon: <Users size={24} /> },
    { divider: true },
    { key: "themes", label: "Themes", icon: <Palette size={24} /> },
    {
      key: "time-language",
      label: "Time / Language",
      icon: <Settings2 size={24} />,
    },
  ];

  const getTabButtonClass = (tab) =>
    `flex items-center gap-1.5 p-3 rounded-lg text-md w-full text-nowrap ${
      activeTab === tab ? "bg-[var(--btn)] text-white" : "hover:bg-ter"
    }`;

  return (
    <>
      <aside className="w-60 xl:w-72 h-screen bg-sec shadow-md relative">
        <h1 className="px-8 py-4 mt-6 text-xl font-bold pb-0">Settings</h1>
        <nav className="p-2 xl:p-4 space-y-0">
          <Button
            variant="secondary"
            onClick={() => onTabChange("basic-info")}
            className={getTabButtonClass("basic-info")}
          >
            <CircleUser size={24} /> Basic Info
          </Button>
          <Button
            variant="secondary"
            onClick={() => onTabChange("Edu-&-skills")}
            className={getTabButtonClass("Edu-&-skills")}
          >
            <GraduationCap size={24} /> Education & skills
          </Button>
          <Button 
            variant="secondary"
            onClick={() => onTabChange("account")}
            className={getTabButtonClass("account")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-shield-user-icon lucide-shield-user"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="M6.376 18.91a6 6 0 0 1 11.249.003" />
              <circle cx="12" cy="11" r="4" />
            </svg>{" "}
            Account
          </Button>
          <Button
            variant="secondary"
            onClick={() => onTabChange("friends")}
            className={getTabButtonClass("friends")}
          >
            <Users size={24} /> Friends
          </Button>
          <div>
            <div className="border-t border-gray-400/30 my-2 "></div>
          </div>
          <Button
            variant="secondary"
            onClick={() => onTabChange("themes")}
            className={getTabButtonClass("themes")}
          >
            <Palette size={24} /> Themes
          </Button>
          <Button
            variant="secondary"
            onClick={() => onTabChange("time-language")}
            className={getTabButtonClass("time-language")}
          >
            <Settings2 size={24} /> Time / language
          </Button>

          {tabs.map((tab, idx) =>
            tab.divider ? (
              <div
                key={`divider-${idx}`}
                className="border-t border-gray-400/30 !my-2"
              />
            ) : (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={getTabButtonClass(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            )
          )}

        </nav>

        <div className="absolute bottom-4 w-full px-4">
          {user ? (
            <Button
              variant="danger"
              onClick={() => {
                setShowLogoutModal(true);
              }}

            <Button
              onClick={() => setShowLogoutModal(true)}
              className="m-auto flex items-center justify-center px-4 py-2 text-red-400 transition-colors hover:bg-red-500 hover:text-white rounded gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => navigate("/authenticate")}
              className="m-auto flex items-center justify-center px-5 py-2 text-green-400 transition-colors hover:bg-green-500 hover:text-white rounded-lg gap-2 border border-green-500"
            >
              <LogIn size={16} />
              Login
            </Button>
          )}
        </div>
      </aside>

      {showLogoutModal && (
        <ConfirmLogoutModal
          onConfirm={() => {
            setShowLogoutModal(false);
            navigate("/signout");
          }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
