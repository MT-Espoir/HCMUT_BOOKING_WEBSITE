import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainPage from './views/main/MainPage';
import RoomSearchPage from './views/room-search/RoomSearchPage';
import Roomselection from './views/room-selection/Roomselection';
import Confirmbookingpage from './views/confirm-booking/Confirmbooking';
import CheckingPage from './views/checking/Checkingpage';
import MyRoomPage from './views/my-room/Myroom';
import ChangeRoomPage from './views/change-room/Changeroom';
import UsageReportPage from './views/usage-report/UsageReportPage';
import UserVerificationPage from './views/user-verification/UserVerificationPage';
import UserVerification1 from './views/user-verification/UserVerification1';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/room-search" element={<RoomSearchPage />} />
      <Route path="/room-selection" element={<Roomselection />} />
      <Route path="/confirm-booking" element={<Confirmbookingpage />} />
      <Route path="/checking" element={<CheckingPage />} />
      <Route path="/myroom" element={<MyRoomPage />} />
      <Route path="/changeroom/:bookingId" element={<ChangeRoomPage />} />
      <Route path="/report" element={<UsageReportPage />} />
      <Route path="/user-verification" element={<UserVerificationPage />} />
      <Route path="/user-verification/:userId" element={<UserVerification1 />} />
    </Routes>
  );
};

export default AppRoutes;
