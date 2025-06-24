import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Sidebar from "@/components/settings/Sidebar";
import BasicInfo from "@/components/settings/BasicInfo";
import Account from "@/components/settings/Account";
import Friends from "@/components/settings/Friends";
import Themes from "@/components/settings/Themes";
import EducationAndSkills from "@/components/settings/EducationAndSkills";
import TimeLanguage from "@/components/settings/TimeLanguage";

const Settings = () => {
  const { user, fetchUserDetails } = useUserProfile();
  const [activeTab, setActiveTab] = useState("basic-info");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        fetchUserDetails(decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const loginButton = (
    <div className="flex flex-col items-center justify-center h-full">
      <div className=" w-[450px] flex flex-col items-center">
        <h1 className="mb-4 text-4xl text-[var(--txt)] text-center">
          You are not logged-in.
        </h1>
        <p className="mb-4 text-md text-[var(--txt-dim)] -mt-2 text-center opacity-80">
          To access your profile, connect with friends, view your stats, and
          enjoy all features, please log in to your account.
        </p>
        <button
          onClick={() => (window.location.href = "/authenticate")}
          className="px-5 py-2.5 btn text-white rounded-lg hover:btn-hover mt-6 transition-colors"
        >
          Login to Eduhaven
        </button>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    const protectedTabs = ["basic-info", "Edu-&-skills", "account", "friends"];
    if (!user && protectedTabs.includes(activeTab)) {
      return loginButton;
    }

    switch (activeTab) {
      case "basic-info":
        return <BasicInfo />;
      case "Edu-&-skills":
        return <EducationAndSkills />;
      case "account":
        return <Account />;
      case "friends":
        return <Friends />;
      case "themes":
        return <Themes />;
      case "time-language":
        return <TimeLanguage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-[100vw-70px] overflow-hidden m-auto">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} user={user} />
      <main className="p-6 py-10 bg-primary w-full h-screen overflow-y-auto">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Settings;
