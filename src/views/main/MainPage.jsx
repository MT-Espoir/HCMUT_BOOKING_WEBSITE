import React from 'react';
import Header from '../../components/common/Header';
import MainContent from './MainContent';
import './MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <Header />
      <MainContent />
    </div>
  );
};

export default MainPage;
