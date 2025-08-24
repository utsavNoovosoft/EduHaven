import React, { useState, useEffect } from 'react';
import { Award, Info } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  checkBadgeAchievements, 
  getAllBadges, 
  saveBadgesToStorage, 
  loadBadgesFromStorage,
  getNewlyEarnedBadges 
} from '@/utils/badgeSystem';
import { useUserProfile } from '@/contexts/UserProfileContext';
import BadgeModal from './BadgeModal';
import BadgeTooltip from './BadgeTooltip';

const backendUrl = import.meta.env.VITE_API_URL;

const Badges = () => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goals, setGoals] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user, fetchUserDetails } = useUserProfile();

  // Get user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        
        // Fetch user details if not already loaded
        if (!user) {
          fetchUserDetails(decoded.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [user, fetchUserDetails]);

  // Fetch user's goals/todos
  useEffect(() => {
    const fetchGoals = async () => {
      if (!userId) return;
      
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/todo`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGoals(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
        // If API fails, use empty array
        setGoals([]);
      }
    };

    fetchGoals();
  }, [userId]);

  // Check badge achievements whenever user or goals change
  useEffect(() => {
    if (user && userId) {
      const previousBadges = loadBadgesFromStorage(userId);
      const currentBadges = checkBadgeAchievements(user, goals);
      
      // Save current badges to storage first (this will add timestamps for new badges)
      saveBadgesToStorage(userId, currentBadges);
      
      // Only show notifications if this is NOT the initial load
      if (!isInitialLoad) {
        // Check for newly earned badges with timestamp validation
        const newBadges = getNewlyEarnedBadges(previousBadges, currentBadges, userId);
        
        // Show notifications for genuinely new badges
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
      }
      
      setEarnedBadges(currentBadges);
      
      // Mark that initial load is complete
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [user, goals, userId, isInitialLoad]);

  const allBadges = getAllBadges();
  const maxDisplayBadges = 10;

  return (
    <>
      <div className="bg-[var(--bg-sec)] rounded-3xl shadow-lg p-6 w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-center flex-1">Badges Earned</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 hover:bg-[var(--bg-ter)] rounded-lg transition-colors group"
            title="View all badges"
          >
            <Info className="w-5 h-5 text-[var(--txt-dim)] group-hover:text-[var(--txt)]" />
          </button>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {/* Display earned badges first */}
          {earnedBadges.slice(0, maxDisplayBadges).map((badge) => (
            <BadgeTooltip key={badge.id} badge={badge}>
              <div className="flex flex-col items-center cursor-help">
                <div className="relative">
                  <img
                    src={badge.icon}
                    alt={badge.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full items-center justify-center text-white font-bold text-xs hidden"
                  >
                    {badge.name.charAt(0)}
                  </div>
                </div>
                <p className="text-xs mt-1 text-center text-[var(--txt)]">{badge.name}</p>
              </div>
            </BadgeTooltip>
          ))}
          
          {/* Fill remaining slots with placeholder badges */}
          {Array.from({ length: Math.max(0, maxDisplayBadges - earnedBadges.length) }, (_, i) => (
            <div key={`placeholder-${i}`} className="flex flex-col items-center opacity-30">
              <div className="w-8 h-8 bg-[var(--bg-ter)] rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-[var(--txt-dim)]" />
              </div>
              <p className="text-xs mt-1 text-[var(--txt-dim)]">Locked</p>
            </div>
          ))}
        </div>
        
        {earnedBadges.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-[var(--txt-dim)]">
              {earnedBadges.length} of {allBadges.length} badges earned
            </p>
          </div>
        )}
      </div>

      <BadgeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default Badges;
