// components/ProfileCard/ProfileDetails.jsx
import { Landmark, Puzzle, DraftingCompass, Earth } from "lucide-react";

const ProfileDetails = ({ user }) => {
  return (
    <div className="bg-gray-500/20 rounded-3xl p-4 space-y-4">
      {user.FieldOfStudy && (
        <div className="flex items-center gap-4 text-[var(--text-secondary)]">
          <Landmark className="h-7 w-7 flex-shrink-0" />
          <div>
            <p className="text-xs">{user.University || "Field of Study"}</p>
            <p className="text-lg text-[var(--text-primary)]">
              {user.FieldOfStudy}
              {", " + user.GraduationYear || ""}
            </p>
          </div>
        </div>
      )}

      {user.OtherDetails?.skills && (
        <div className="flex items-center gap-4 text-[var(--text-secondary)]">
          <Puzzle className="h-7 w-7 flex-shrink-0" />
          <div>
            <p className="text-xs">Skills</p>
            <p className="text-lg text-[var(--text-primary)]">
              {user.OtherDetails.skills}
            </p>
          </div>
        </div>
      )}

      {user.OtherDetails?.interests && (
        <div className="flex items-center gap-4 text-[var(--text-secondary)]">
          <DraftingCompass className="h-7 w-7 flex-shrink-0" />
          <div>
            <p className="text-xs">Interests</p>
            <p className="text-lg text-[var(--text-primary)]">
              {user.OtherDetails.interests}
            </p>
          </div>
        </div>
      )}

      {user.Country && (
        <div className="flex items-center gap-4 text-[var(--text-secondary)]">
          <Earth className="h-7 w-7" />
          <div>
            <p className="text-xs">Country</p>
            <p className="text-lg text-[var(--text-primary)]">{user.Country}</p>
          </div>
        </div>
      )}

      {user.OtherDetails?.additionalNotes && (
        <div className="flex gap-3 text-[var(--text-secondary)]">
          <span>{user.OtherDetails.additionalNotes}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
