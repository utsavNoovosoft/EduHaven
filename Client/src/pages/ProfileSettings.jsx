import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Sidebar from "@/components/profileSettings/Sidebar";
import BasicInfo from "@/components/profileSettings/BasicInfo";
import Account from "@/components/profileSettings/Account";
import Friends from "@/components/profileSettings/Friends";
import Themes from "@/components/profileSettings/Themes";
import EducationAndSkills from "@/components/profileSettings/EducationAndSkills";
import TimeLanguage from "@/components/profileSettings/TimeLanguage";

const ProfileSettings = () => {
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

  while (!user) return <div>Loading...</div>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signout";
  };

  const renderActiveTab = () => {
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
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="p-6 py-10 bg-primary w-full h-screen overflow-y-auto">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default ProfileSettings;
