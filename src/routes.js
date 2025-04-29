import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GuestLayout from './layouts/GuestLayout';
import UserLayout from './layouts/UserLayout';
import MainPageGuest from './views/guest/MainPageGuest';
import MainPage from './views/main/MainPage';
import RoomSearchPage from './views/room-search/RoomSearchPage';
import Roomselection from './views/room-selection/Roomselection';
import Confirmbookingpage from './views/confirm-booking/Confirmbooking';
import CheckingPage from './views/checking/Checkingpage';
import MyRoomPage from './views/my-room/Myroom';
import ChangeRoomPage from './views/change-room/Changeroom';
import LoginPage from './views/auth/LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import QuanLy from './views/manager/quanly.jsx';
import QuanLyThietBi from './views/manager-device/quanlythietbi.jsx';
import QuanLyQuyenHeThong from './views/manager-system/quanlyquyenhethong.jsx';
import UsageReportPage from './views/usage-report/UsageReportPage';
import UserVerificationPage from './views/user-verification/UserVerificationPage';
import UserVerification1 from './views/user-verification/UserVerification1';
import About from './views/aboutpage/about';

const AppRoutes = () => (
  <Routes>
    {/* Guest Layout */}
    <Route element={<GuestLayout />}>
      <Route path="/" element={<MainPageGuest />} />
      <Route path="/login" element={<LoginPage />} />
    </Route>

    {/* User Layout + protected with PrivateRoute */}
    <Route
      element={
        <PrivateRoute redirectPath="/">
          <UserLayout />
        </PrivateRoute>
      }
    >
      <Route path="/home" element={<MainPage />} />
      <Route path="/room-search" element={<RoomSearchPage />} />
      <Route path="/room-selection" element={<Roomselection />} />
      <Route path="/confirm-booking" element={<Confirmbookingpage />} />
      <Route path="/checking" element={<CheckingPage />} />
      <Route path="/myroom" element={<MyRoomPage />} />
      <Route path="/changeroom/:bookingId" element={<ChangeRoomPage />} />
      <Route path="/about" element={<About />} />
    </Route>

    {/* Manager Routes - Không sử dụng layout chung */}
    <Route
      path="/manager"
      element={
        <PrivateRoute redirectPath="/">
          <QuanLy />
        </PrivateRoute>
      }
    />
    <Route
      path="/manager-device"
      element={
        <PrivateRoute redirectPath="/">
          <QuanLyThietBi />
        </PrivateRoute>
      }
    />
    <Route
      path="/manager-system"
      element={
        <PrivateRoute redirectPath="/">
          <QuanLyQuyenHeThong />
        </PrivateRoute>
      }
    />
    <Route
      path="/usage-report"
      element={
        <PrivateRoute redirectPath="/">
          <UsageReportPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/user-verification"
      element={
        <PrivateRoute redirectPath="/">
          <UserVerificationPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/user-verification/:userId"
      element={
        <PrivateRoute redirectPath="/">
          <UserVerification1 />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;