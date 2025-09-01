import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  acceptRequest,
  cancelRequest,
  fetchFriends,
  fetchRequests,
  fetchSent,
  fetchSuggestions,
  rejectRequest,
  removeFriend,
  sendRequest,
} from "../api/friendApi";
import { handleApiError } from "@/utils/errorHandler";

export const useFriendRequests = () =>
  useQuery({
    queryKey: ["friendRequests"],
    queryFn: fetchRequests,
    staleTime: 1000 * 60,
    onError: (err) => handleApiError(err, "Error fetching friend requests"),
  });

export const useAcceptRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: acceptRequest,
    onSuccess: () => {
      toast.success("Friend request accepted!");
      qc.invalidateQueries({ queryKey: ["friendRequests"] });
      qc.invalidateQueries({ queryKey: ["friends"] }); // refresh friends
    },
    onError: (err) => handleApiError(err, "Error accepting friend request"),
  });
};

export const useRejectRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectRequest,
    onSuccess: () => {
      toast.info("Friend request rejected.");
      qc.invalidateQueries({ queryKey: ["friendRequests"] });
    },
    onError: (err) => handleApiError(err, "Error rejecting friend request"),
  });
};

export const useSentRequests = () =>
  useQuery({
    queryKey: ["sentRequests"],
    queryFn: fetchSent,
    staleTime: 1000 * 60,
    onError: (err) => handleApiError(err, "Error fetching sent requests"),
  });

export const useCancelRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelRequest,
    onSuccess: () => {
      toast.info("Friend request canceled.");
      qc.invalidateQueries({ queryKey: ["sentRequests"] });
      qc.invalidateQueries({ queryKey: ["friendSuggestions"] });
    },
    onError: (err) => handleApiError(err, "Error canceling friend request!"),
  });
};

export const useFriends = () =>
  useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
    staleTime: 1000 * 60,
    onError: (err) => handleApiError(err, "Error fetching friends"),
  });

export const useRemoveFriend = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed!");
      qc.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (err) => handleApiError(err, "Error removing friend!"),
  });
};

export const useFriendSuggestions = ({ all = false } = {}) => {
  return useInfiniteQuery({
    queryKey: ["friendSuggestions", { all }],
    queryFn: fetchSuggestions,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    onError: (err) => handleApiError(err, "Error fetching friend suggestions"),
  });
};

export const useSendRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendRequest,
    onSuccess: () => {
      toast.success("Friend request sent!");
      qc.invalidateQueries({ queryKey: ["friendSuggestions"] });
      qc.invalidateQueries({ queryKey: ["sentRequests"] });
    },
    onError: (err) => handleApiError(err, "Error sending friend request!"),
  });
};
