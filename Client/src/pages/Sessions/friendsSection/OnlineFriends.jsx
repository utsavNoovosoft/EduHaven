import { User } from "lucide-react";

function OnlineFriends() {
  const onlineFriends = [];

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Online Friends</h2>
      {onlineFriends.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto">
          {onlineFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex flex-col items-center bg-gray-800 p-4 rounded-3xl shadow transition-colors min-w-[150px]"
            >
              <div className="p-2 bg-purple-500 rounded-full">
                <User className="w-10 h-10" />
              </div>
              <h4 className="mt-2 text-sm font-medium text-center">
                {friend.name}
              </h4>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">
          online friends is not currently functional
        </p>
      )}
    </section>
  );
}

export default OnlineFriends;
