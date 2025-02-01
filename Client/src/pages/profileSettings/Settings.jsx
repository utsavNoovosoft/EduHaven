const Settings = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Appearance & Preferences</h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1">Theme</label>
          <select className="w-full border rounded px-3 py-2">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Clock Format</label>
          <select className="w-full border rounded px-3 py-2">
            <option>12-hour</option>
            <option>24-hour</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Language</label>
          <select className="w-full border rounded px-3 py-2">
            <option>English</option>
            <option>Spanish</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default Settings;
