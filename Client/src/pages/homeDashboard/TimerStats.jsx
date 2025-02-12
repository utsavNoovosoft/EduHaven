import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Clock4, Flame, BarChart2 } from "lucide-react";

// Variants for dropdown buttons
const dropdownButtonVariants = {
  initial: { backgroundColor: "transparent" },
  hover: { backgroundColor: "#374151" }, // same as Tailwind's bg-gray-700 (rgb(55,65,81))
};

function StudyStats() {
  const [selectedTime, setSelectedTime] = useState("Today");
  const [isOpen, setIsOpen] = useState(false);
  const studyData = {
    Today: "0.5 h",
    "This week": "3.2 h",
    "This month": "10.4 h",
    "All time": "45.8 h",
  };

  return (
    <motion.div
      className="text-white m-4 mt-2 w-[25%] h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dropdown */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1 text-gray-300 hover:text-white ml-auto"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span>{selectedTime}</span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="absolute right-0 top-5 mt-2 w-32 bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden z-10"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {Object.keys(studyData).map((time) => (
                <motion.button
                  key={time}
                  className="block w-full text-left px-4 py-2"
                  variants={dropdownButtonVariants}
                  initial="initial"
                  whileHover="hover"
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setSelectedTime(time);
                    setIsOpen(false);
                  }}
                >
                  {time}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="flex items-center gap-4 mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Clock4 className="h-12 w-12 p-2.5 bg-green-400/70 rounded-full text-gray-100" />
        <p className="text-2xl text-gray-300 font-bold ">
          {studyData[selectedTime]}
        </p>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <BarChart2 className="h-12 w-12 p-2.5 bg-blue-400/70 rounded-full text-gray-100" />
        <p className="text-2xl font-bold text-blue-400">#36385</p>
      </motion.div>

      <motion.div
        className="flex items-center gap-4 mb-3"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Flame className="h-12 w-12 p-2.5 bg-yellow-400/70 rounded-full text-gray-100" />
        <p className="text-2xl font-bold text-yellow-400">20 days</p>
      </motion.div>

      <motion.p
        className="text-md text-gray-200 pl-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        Beginner (1-2h)
      </motion.p>
      <div className="relative w-full bg-gray-700 h-5 rounded-2xl mt-2">
        <motion.p
          className="absolute h-full w-full pr-5 text-gray-300 text-sm text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          1.8h left
        </motion.p>
        <motion.div
          className="bg-purple-500 h-5 rounded-2xl"
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          transition={{ duration: 0.5, delay: 0.5 }}
        ></motion.div>
      </div>
    </motion.div>
  );
}

export default StudyStats;
