import React, { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import EventPopup from "./eventPopup";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const daysArray = [...Array(daysInMonth).keys()].map((day) => day + 1);
  const [selectedDay, setSelectedDay] = useState(null);
  const [time, setTime] = useState(new Date());

  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/events");
      if (response.data.success) {
        setEvents(response.data.data);

        // Process upcoming events
        const today = new Date();
        const futureEvents = response.data.data.filter(
          (event) => new Date(event.date) >= today
        );
        futureEvents.sort(
          (a, b) => new Date(a.date) - new Date(b.date) // Sort by date
        );
        setUpcomingEvents(futureEvents.slice(0, 2)); // Limit to two events
      } else {
        console.error("Failed to fetch events:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching events:", error.message);
    }
  };

  useEffect(() => {
    fetchEvents();

    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDayClick = (day) => {
    const date = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const event = events.find((e) => e.date === date);
    setSelectedDay(date);
    setSelectedEvent(event || { date });
  };

  const handleClosePopup = () => {
    setSelectedDay(null);
    setSelectedEvent(null);
  };

  const blankDays = Array(firstDayOfMonth).fill(null);
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const [timePart, period] = formattedTime.split(" ");
  return (
    <>
      <div className="bg-gray-800 pt-6 rounded-3xl shadow-lg flex flex-col">
        {/* Header: Time and Day */}
        <div className="px-6">
          <h1 className="text-5xl font-thin text-white mb-2">
            {timePart} <span className="text-xl">{period}</span>
          </h1>
          <h2 className="text-md text-gray-300">
            Today's{" "}
            {
              "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(
                " "
              )[currentDate.getDay()]
            }
          </h2>
        </div>
        <hr className="my-4 opacity-10" />
        {/* Calendar View */}
        <div className="px-4">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-lg font-semibold ">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-full hover:bg-slate-700"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-full hover:bg-slate-700"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-[0.4rem]">
            {"Su Mo Tu We Th Fr Sa".split(" ").map((day) => (
              <div
                key={day}
                className="text-center text-xs font-md text-gray-400"
              >
                {day}
              </div>
            ))}
            {blankDays.map((_, index) => (
              <div key={`blank-${index}`} className="p-3"></div>
            ))}
            {daysArray.map((day) => {
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();
              const hasEvent = Object.values(events).some((event) => {
                const eventDate = parseISO(event.date);
                return (
                  eventDate.getDate() === day &&
                  eventDate.getMonth() === currentDate.getMonth() &&
                  eventDate.getFullYear() === currentDate.getFullYear()
                );
              });
              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`flex items-center justify-center p-2.5 text-sm rounded-full  text-gray-200 cursor-pointer transition-all duration-200 ease-in-out h-9 
                  ${isToday ? "bg-purple-600 hover:bg-purple-700" : ""}
                  ${
                    hasEvent && !isToday
                      ? "bg-gray-700 hover:bg-gray-600"
                      : ""
                  }
                  ${!isToday && !hasEvent ? " hover:bg-gray-700" : ""}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="p-6 rounded-3xl bg-[#2d364a] flex-1 mt-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Upcoming Events:
          </h3>
          {upcomingEvents.length > 0 ? (
            <ul className="text-gray-200 space-y-6 pl-2">
              {upcomingEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <li
                    key={event.id}
                    className="pl-3 border-l-4 border-purple-500"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        {eventDate.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">
                        {eventDate.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    </div>
                    <span className="block mt-1">{event.title}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">No events.</p>
          )}
        </div>
      </div>

      {selectedDay && (
        <EventPopup
          date={selectedDay}
          onClose={handleClosePopup}
          refreshEvents={fetchEvents}
        />
      )}
    </>
  );
}

export default Calendar;
