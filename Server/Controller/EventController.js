import Event from "../Model/EventModel.js";
import User from "../Model/UserModel.js";

export const getAllEvents = async (req, res) => {
    try {
        // Handle migration for events without createdBy field
        await Event.updateMany(
            { createdBy: { $exists: false } },
            { $set: { createdBy: req.user._id } }
        );

        // Only return events created by the authenticated user
        const events = await Event.find({ createdBy: req.user._id });
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEventByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ success: false, error: "Date query parameter is required." });
        }

        // Adjusting date format to match database entries (ignoring time part)
        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Find events within the day range for the authenticated user only
        const events = await Event.find({
            createdBy: req.user._id,
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        if (events.length === 0) {
            return res.status(404).json({ success: false, error: "No events found for the specified date." });
        }

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        // Only allow users to access their own events
        const event = await Event.findOne({ 
            _id: req.params.id, 
            createdBy: req.user._id 
        });
        
        if (!event) {
            return res.status(404).json({ success: false, error: "Event not found" });
        }
        
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, date, time } = req.body;
        
        // Validation
        if (!title || !date || !time) {
            return res.status(400).json({ success: false, error: "Title, date, and time are required." });
        }

        // Associate event with the authenticated user
        const newEvent = new Event({ 
            title, 
            date, 
            time, 
            createdBy: req.user._id 
        });
        
        await newEvent.save();
        res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, time } = req.body;

        // Only allow users to update their own events
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: id, createdBy: req.user._id },
            { title, date, time },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ success: false, error: "Event not found or unauthorized" });
        }

        res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        // Only allow users to delete their own events
        const deletedEvent = await Event.findOneAndDelete({ 
            _id: req.params.id, 
            createdBy: req.user._id 
        });
        
        if (!deletedEvent) {
            return res.status(404).json({ success: false, error: "Event not found or unauthorized" });
        }
        
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.query.id || req.user?._id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId).select(
      "streaks rank level badges"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Count total users for rank context
    const totalUsersCount = await User.countDocuments();

    let newBadges = [];
    try {
      console.log("Checking for new badges...");
      newBadges = await checkAllBadges(userId);

      if (newBadges.length > 0) {
        // Refresh badges if new ones were awarded
        const updatedUser = await User.findById(userId).select("badges");
        user.badges = updatedUser.badges;
      }
    } catch (badgeError) {
      console.error("Error checking badges:", badgeError);
    }

    return res.status(200).json({
      rank: user.rank || 0,
      totalUsers: totalUsersCount,
      currentStreak: user.streaks?.current || 0,
      maxStreak: user.streaks?.max || 0,
      level: user.level || {
        name: "Beginner",
        progress: 0,
        hoursToNextLevel: 2,
      },

      badges: user.badges || [],
      newBadges,
      availableBadges: Object.values(BADGES),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return res.status(500).json({
      error: "Failed to fetch user stats",
      details: error.message,
    });
  }
};