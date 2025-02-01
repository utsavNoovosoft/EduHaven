import { Routes, Route } from 'react-router-dom';
import ProfileSettings from './ProfileSettings';
import BasicInfo from './BasicInfo';
import Account from './Account';
import Friends from './Friends';
import Settings from './Settings';

const ProfileRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfileSettings />}>
        <Route index element={<BasicInfo />} />
        <Route path="account" element={<Account />} />
        <Route path="friends" element={<Friends />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default ProfileRoutes;
