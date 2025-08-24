import React, { useState } from 'react';

const BadgeTooltip = ({ badge, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg shadow-lg p-3 min-w-[200px] max-w-[250px]">
            <div className="text-center">
              <h4 className="font-semibold text-[var(--txt)] mb-1">
                {badge.name}
              </h4>
              <p className="text-sm text-[var(--txt-dim)]">
                {badge.description}
              </p>
            </div>
            
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-[var(--bg-primary)]"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeTooltip;
