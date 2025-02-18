import User from "../Model/UserModel.js";

export const userList = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },
        { _id: { $nin: currentUser.friends || [] } },
      ],
    }).select("FirstName LastName ProfilePicture Bio");

    res.json(users);
  } catch (err) {
    console.error("Error in userList:", err);
    res.status(500).json({ error: err.message });
  }
};

export const addFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    if (userId.toString() === friendId) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend." });
    }

    const currentUser = await User.findById(userId);
    if (currentUser.friends.includes(friendId)) {
      return res.status(400).json({ message: "Already friends." });
    }

    await User.findByIdAndUpdate(userId, { $push: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $push: { friends: userId } });

    res.json({ message: "Friend added successfully." });
  } catch (err) {
    console.error("Error in backend:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { friendId } = req.params;

    // Remove friend from both users
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.json({ message: "Friend removed successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const friendList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "FirstName LastName ProfilePicture"
    );
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
