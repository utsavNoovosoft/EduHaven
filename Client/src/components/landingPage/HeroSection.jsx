import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Sample profile data
const profiles = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    role: "UI Designer",
    color: "from-purple-400 to-pink-400",
  },
  {
    id: 2,
    name: "Alex Rivera",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    role: "Developer",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: 3,
    name: "Maya Patel",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    role: "Product Manager",
    color: "from-green-400 to-emerald-400",
  },
  {
    id: 4,
    name: "Jordan Kim",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    role: "Marketing Lead",
    color: "from-orange-400 to-red-400",
  },
  {
    id: 5,
    name: "Emma Watson",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
    role: "Data Scientist",
    color: "from-indigo-400 to-purple-400",
  },
  {
    id: 6,
    name: "Carlos Santos",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    role: "Backend Dev",
    color: "from-teal-400 to-blue-400",
  },
];

function FloatingProfile({ profile, delay = 0, area = "bottom" }) {
  // Generate position based on fixed area
  const generatePositionByArea = () => {
    switch (area) {
      case "left":
        return { x: Math.random() * 15 + 5, y: Math.random() * 60 + 20 }; // Left edge
      case "right":
        return { x: Math.random() * 15 + 80, y: Math.random() * 60 + 20 }; // Right edge
      case "bottom":
      default:
        return { x: Math.random() * 70 + 15, y: Math.random() * 15 + 80 }; // Bottom edge
    }
  };

  const [basePosition] = useState(generatePositionByArea());
  const waveSpeed = 5000 + Math.random() * 3000; // 5-8 seconds per wave
  const waveAmplitude = 4 + Math.random() * 3; // 4-7% amplitude

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, y: 50 }}
      animate={{ opacity: 0.7, scale: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ opacity: 1, scale: 1.1 }}
      className="absolute cursor-pointer group"
      style={{
        left: `${basePosition.x}%`,
        top: `${basePosition.y}%`,
        transform: "translate(-50%, -50%)",
        animation: `floatWave${profile.id} ${waveSpeed}ms ease-in-out infinite`,
      }}
      role="button"
      tabIndex={0}
      aria-label={`${profile.name}, ${profile.role}`}
    >
      <style jsx>{`
        @keyframes floatWave${profile.id} {
          0% {
            transform: translate(-50%, -50%) translate(0px, 0px);
          }
          12.5% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude * 0.4}%, ${waveAmplitude * 0.9}%);
          }
          25% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude * 0.8}%, ${waveAmplitude * 0.9}%);
          }
          37.5% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude}%, 0%);
          }
          50% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude * 0.8}%, -${waveAmplitude * 0.9}%);
          }
          62.5% {
            transform: translate(-50%, -50%)
              translate(${waveAmplitude * 0.4}%, -${waveAmplitude * 0.9}%);
          }
          75% {
            transform: translate(-50%, -50%)
              translate(0%, -${waveAmplitude * 0.9}%);
          }
          87.5% {
            transform: translate(-50%, -50%)
              translate(-${waveAmplitude * 0.4}%, -${waveAmplitude * 0.9}%);
          }
          100% {
            transform: translate(-50%, -50%) translate(0px, 0px);
          }
        }
      `}</style>
      <div
        className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.color} p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300`}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={profile.avatar}
            alt={`${profile.name} - ${profile.role}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {profile.name}
        </div>
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black mx-auto"></div>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
      role="banner"
    >
      {/* Floating Profiles */}
      <div className="absolute inset-0 pointer-events-none">
        {profiles.slice(0, 2).map((profile, index) => (
          <FloatingProfile
            key={profile.id}
            profile={profile}
            delay={0.5 + index * 0.3}
            area="left"
          />
        ))}
        {profiles.slice(2, 4).map((profile, index) => (
          <FloatingProfile
            key={profile.id}
            profile={profile}
            delay={0.8 + index * 0.3}
            area="right"
          />
        ))}
        {profiles.slice(4, 6).map((profile, index) => (
          <FloatingProfile
            key={profile.id}
            profile={profile}
            delay={1.1 + index * 0.3}
            area="bottom"
          />
        ))}
      </div>

      {/* Screenshot */}
      <motion.figure
        className="w-fit mx-auto mb-16 relative overflow-hidden group"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className="h-[50vh] aspect-[2/1] bg-cover bg-center"
          style={{ backgroundImage: "url('/Page1LightScreenshot.png')" }}
          role="img"
          aria-label="EduHaven platform screenshot showing study room interface"
        >
          <div className="absolute bottom-0 left-0 w-full h-[45vh] bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
        </div>
        <figcaption className="sr-only">EduHaven Study Platform Interface</figcaption>
      </motion.figure>

      {/* Text content */}
      <motion.header
        className="absolute top-[40%] left-0 z-20 w-full flex flex-col items-center justify-center text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0 }}
      >
        <motion.h1
          id="hero-heading"
          className="text-[4vw] font-light txt bg-clip-text font-poppins"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Everything you need in one place
        </motion.h1>
        <motion.h2
          className="text-[2.5vw] font-light txt-dim bg-clip-text font-poppins mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          learn, collaborate, & grow together.
        </motion.h2>
        <motion.button
          onClick={() => navigate("/authenticate")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all hover:scale-105 transform duration-300 shadow-lg hover:shadow-xl"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Get started with EduHaven - Create your account or sign in"
        >
          Get started
        </motion.button>
      </motion.header>

      {/* Background ambient effects */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0 }}
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-36 h-36 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
