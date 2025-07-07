import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { RotateCcw } from "lucide-react";

function Slogan() {
  const [quote, setQuote] = useState("Stay hungry; stay foolish.");
  const [author, setAuthor] = useState("");
  const [displayMode, setDisplayMode] = useState("greeting");
  const [firstName, setFirstName] = useState("User");

  const getFirstNameFromJWT = () => {
    const token = localStorage.getItem("token");
    if (!token) return "User";

    const decoded = jwtDecode(token);
    return decoded?.FirstName || "User";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${firstName}.`;
    else if (hour < 18) return `Good afternoon, ${firstName}.`;
    else return `Good evening, ${firstName}.`;
  };

  const fetchQuote = async () => {
    try {
      const apis = [
        "https://api.quotable.io/random",
        "https://zenquotes.io/api/random",
        "https://api.adviceslip.com/advice",
      ];

      for (const apiUrl of apis) {
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();

            if (apiUrl.includes("quotable")) {
              return { quote: data.content, author: data.author };
            } else if (apiUrl.includes("zenquotes")) {
              return { quote: data[0].q, author: data[0].a };
            } else if (apiUrl.includes("adviceslip")) {
              return { quote: data.slip.advice, author: "Anonymous" };
            }
          }
        } catch (apiError) {
          console.error(`Error with ${apiUrl}:`, apiError);
          continue;
        }
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
    }

    const fallbackQuotes = [
      { quote: "Stay hungry; stay foolish.", author: "Steve Jobs" },
      {
        quote: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
      },
      {
        quote: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
      },
      {
        quote:
          "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      },
      {
        quote:
          "Your time is limited, don't waste it living someone else's life.",
        author: "Steve Jobs",
      },
    ];

    return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
  };

  const shouldRefreshQuote = () => {
    const cachedDate = localStorage.getItem("quoteTimestamp");
    if (!cachedDate) return true;

    const ninetyMinAgo = Date.now() - 180 * 60 * 1000;
    return parseInt(cachedDate) < ninetyMinAgo;
  };

  const forceRefreshQuote = async () => {
    setQuote("Fetching new quote...");
    setAuthor("");
    try {
      const fetchedData = await fetchQuote();
      setQuote(fetchedData.quote);
      setAuthor(fetchedData.author);
      localStorage.setItem("dailyQuote", fetchedData.quote);
      localStorage.setItem("quoteAuthor", fetchedData.author);
      localStorage.setItem("quoteTimestamp", Date.now().toString());
      console.log("Quote refreshed:", fetchedData);
    } catch (error) {
      setQuote("Failed to fetch quote.");
      setAuthor("Try again");
      console.error("Error during refresh:", error);
    }
  };

  const handleIconClick = () => {
    forceRefreshQuote();
  };

  useEffect(() => {
    setFirstName(getFirstNameFromJWT());

    const cachedQuote = localStorage.getItem("dailyQuote");
    const cachedAuthor = localStorage.getItem("quoteAuthor");

    if (cachedQuote && !shouldRefreshQuote()) {
      setQuote(cachedQuote);
      setAuthor(cachedAuthor || "");
      console.log("Using cached quote:", cachedQuote);
    } else {
      console.log("Fetching new quote...");
      fetchQuote().then((fetchedData) => {
        setQuote(fetchedData.quote);
        setAuthor(fetchedData.author);
        localStorage.setItem("dailyQuote", fetchedData.quote);
        localStorage.setItem("quoteAuthor", fetchedData.author);
        localStorage.setItem("quoteTimestamp", Date.now().toString());
        console.log("New quote fetched:", fetchedData);
      });
    }
  }, []);

  useEffect(() => {
    const duration = displayMode === "greeting" ? 5000 : 12 * 60 * 1000;
    const timer = setTimeout(() => {
      setDisplayMode((prev) => (prev === "greeting" ? "quote" : "greeting"));
    }, duration);

    return () => clearTimeout(timer);
  }, [displayMode]);

  const textVariants = {
    initial: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: "blur(10px)",
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="slogan text-2xl font-semibold txt min-h-[3rem] flex items-center justify-center relative group">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayMode + (displayMode === "quote" ? quote : getGreeting())}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-center max-w-4xl px-4"
        >
          {displayMode === "quote" ? (
            <div className="flex items-end gap-4">
              <div>{quote}</div>
              {author && author !== "Anonymous" && (
                <div className="text-xs txt-dim mb-1">— {author}</div>
              )}
              <motion.div
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="txt-dim opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                onClick={handleIconClick}
                title="Refresh Quote"
              >
                <RotateCcw size={20} />
              </motion.div>
            </div>
          ) : (
            getGreeting()
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Slogan;
