import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UpdateButton from "./UpdateButton";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    setHasChanged(email !== "" && password !== "");
  }, [email, password]);

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // simulate async update
    setTimeout(() => {
      toast.success("Account updated");
      setIsLoading(false);
    }, 1000);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      toast.success(data.message || "Account deleted successfully");

      localStorage.removeItem("token");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--txt)] mb-6">
        Account Settings
      </h1>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-md font-medium text-[var(--txt-dim)]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-md font-medium text-[var(--txt-dim)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-4 py-3 bg-[var(--bg-sec)] border border-transparent rounded-lg text-[var(--txt)] placeholder-[var(--txt-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--btn)] transition-all"
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end">
          <UpdateButton
            label="Update Account"
            isLoading={isLoading}
            isDisabled={!hasChanged}
          />
        </div>
      </form>

      <div className="mt-8 border-t border-gray-400/40 pt-6">
        <button
          type="button"
          onClick={handleDelete}
          className="px-6 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-md"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Account;
