import axiosInstance from "@/utils/axios";

// gets all the incoming friend requests
export const fetchRequests = async () => {
  const res = await axiosInstance.get("/friends/requests");
  return res.data || [];
};

// accepts a friend request
export const acceptRequest = async (friendId) => {
  const res = await axiosInstance.post(`/friends/accept/${friendId}`, null);
  return res.data;
};

// rejects a friend request
export const rejectRequest = async (friendId) => {
  const res = await axiosInstance.delete(`/friends/reject/${friendId}`);
  return res.data;
};

// get all the sent friend requests
export const fetchSent = async () => {
  const res = await axiosInstance.get("/friends/sent-requests");
  return res.data || [];
};

// cancels a sent friend request
export const cancelRequest = async (friendId) => {
  const res = await axiosInstance.delete(`/friends/sent-requests/${friendId}`);
  return res.data;
};

// get all the friends
export const fetchFriends = async () => {
  const res = await axiosInstance.get("/friends");
  return res.data || [];
};

// removes a friend
export const removeFriend = async (friendId) => {
  const res = await axiosInstance.delete(`/friends/${friendId}`);
  return res.data;
};

// returns the friend suggestions
export const fetchSuggestions = async ({ pageParam = 1, queryKey }) => {
  const [_key, { all }] = queryKey;
  const limit = 20;

  const res = await axiosInstance.get(
    `/friends/friend-suggestions?page=${pageParam}&limit=${limit}&all=${all}`
  );

  return {
    data: res.data || [],
    nextPage: res.data?.length === limit ? pageParam + 1 : undefined,
  };
};


// sends a friend request
export const sendRequest = async (friendId) => {
  const res = await axiosInstance.post(`/friends/request/${friendId}`, null);
  return res.data;
};
