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

  return (
    <>
      <div className="bg-gray-800 py-8 rounded-xl shadow-lg">
        {/* Header: Time and Day */}
        <div className="px-8">
          <h1 className="text-5xl font-thin text-white mb-2">
            {time.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </h1>
          <h2 className="text-l text-gray-300">
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
        <div className="px-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold pl-2.5">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-5">
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
            {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
              <div
                key={day}
                className="text-center text-sm font-bold text-gray-500"
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
                  className={`flex items-center justify-center p-3 rounded-lg text-white cursor-pointer transition-all duration-200 ease-in-out h-11 mb-1
                  ${isToday ? "bg-purple-600 hover:bg-purple-700" : ""}
                  ${
                    hasEvent && !isToday
                      ? "bg-purple-900 hover:bg-purple-700"
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
        <hr className="my-4 opacity-10" />
        {/* Upcoming Events Section */}
        <div className="px-8">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            Upcoming Events:
          </h3>
          {upcomingEvents.length > 0 ? (
            <ul className="text-gray-200 space-y-4 pl-2">
              {upcomingEvents.map((event) => {
                const eventDate = new Date(event.date);
                return (
                  <li
                    key={event.id}
                    className="pl-3 border-l-4 border-purple-500 flex gap-4 items-center"
                  >
                    <div className="">
                      <div className="font-semibold text-gray-300">
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
