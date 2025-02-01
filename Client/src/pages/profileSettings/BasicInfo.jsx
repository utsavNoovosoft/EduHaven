import { useState } from 'react';
const BasicInfo = () => {
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    // Handle file upload logic if needed
    setProfilePic(file);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Basic Information</h1>
      <form className="space-y-4">
        {/* Profile Picture */}
        <div>
          <label className="block mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className="w-full"
          />
          {profilePic && (
            <p className="mt-2 text-sm text-gray-600">Selected: {profilePic.name}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            placeholder="Your full name"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1">Bio</label>
          <textarea
            placeholder="Tell us about yourself"
            className="w-full bg-gray-700 text-white rounded px-3 py-2 border-0"
            rows="4"
          ></textarea>
        </div>

        {/* University (Optional) */}
        <div>
          <label className="block mb-1">
            University <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="Your university"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Country (Optional) */}
        <div>
          <label className="block mb-1">
            Country <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="Your country"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Field of Study (Optional) */}
        <div>
          <label className="block mb-1">
            Field of Study <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="Your field of study"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Graduation Year (Optional) */}
        <div>
          <label className="block mb-1">
            Graduation Year <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <input
            type="number"
            placeholder="e.g. 2026"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Gender (Optional) */}
        <div>
          <label className="block mb-1">
            Gender <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <select className="w-full border rounded px-3 py-2">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        {/* Additional Details (Optional) */}
        <div>
          <label className="block mb-1">
            Other Details <span className="text-sm text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="Any other details you want to share"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default BasicInfo;
