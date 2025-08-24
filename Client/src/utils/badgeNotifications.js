import { toast } from "react-toastify";
import { 
  checkBadgeAchievements, 
  saveBadgesToStorage, 
  loadBadgesFromStorage,
  getNewlyEarnedBadges 
} from './badgeSystem';

// Global badge checker that can be called from anywhere
export const triggerBadgeCheck = (user, goals = [], userId = null) => {
  if (!user || !userId) return;
  
  const previousBadges = loadBadgesFromStorage(userId);
  const currentBadges = checkBadgeAchievements(user, goals);
  
  // Check for newly earned badges
  const newBadges = getNewlyEarnedBadges(previousBadges, currentBadges);
  
  // Show notifications for new badges
  newBadges.forEach(badge => {
    toast.success(`🏆 Badge Earned: ${badge.name}!`, {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        background: "var(--bg-sec)",
        color: "var(--txt)",
        border: "1px solid var(--accent)",
      },
      progressStyle: {
        background: "var(--accent)",
      },
    });
  });
  
  // Save current badges to storage
  saveBadgesToStorage(userId, currentBadges);
  
  return {
    previousBadges,
    currentBadges,
    newBadges,
    hasNewBadges: newBadges.length > 0
  };
};

// Hook to use badge checking in React components
export const useBadgeChecker = () => {
  return { triggerBadgeCheck };
};
