import { User, MessageCircle, ThumbsUp } from "lucide-react";

const ProfileCard = () => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center w-full">
      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <User className="w-12 h-12 text-gray-300" />
      </div>
      <h2 className="text-2xl font-bold">John Doe</h2>
      <p className="text-gray-400 mt-2 w-64 text-center">Passionate coder and tech enthusiast. Love building modern UIs.</p>
      <p className="mt-3 text-gray-300 font-medium">Rank: <span className="text-blue-400">#343467</span></p>

      <div className="flex gap-3 mt-4">
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-2 rounded-md">
          <ThumbsUp className="w-4 h-4" /> Kudos
        </button>
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition-colors px-3 py-2 rounded-md">
          <MessageCircle className="w-4 h-4" /> Message
        </button>
      </div>
      <button className="mt-4 w-full bg-blue-700 hover:bg-blue-800 transition-colors px-3 py-2 rounded-md">
        Add Friend
      </button>
      <div className="mt-4 flex flex-col gap-1 w-full">
        <button className="text-sm text-gray-300 hover:underline">University: XYZ Institute</button>
        <button className="text-sm text-gray-300 hover:underline">Country: USA</button>
        <button className="text-sm text-gray-300 hover:underline">Member Since: 2022</button>
      </div>
    </div>
  );
};

export default ProfileCard;
