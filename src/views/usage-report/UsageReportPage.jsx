import React, { useState } from 'react';
import './UsageReportPage.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUser } from 'react-icons/fa';

const UsageReportPage = () => {
  const [dateRange, setDateRange] = useState({ start: '14/03/2025', end: '17/03/2025' });
  const roomName = '';

  const bookings = [
    { id: 1, user: 'Nguyễn Văn A', email: 'email@gamil.com' },
    { id: 2, user: 'Lê Thị B', email: 'email@gamil.com' },
    { id: 3, user: 'Trần Thanh C', email: 'email@gamil.com' },
  ];

  // Booking data for the graph
  const bookingData = [
    { date: '14/03', count: 3 },
    { date: '15/03', count: 5 },
    { date: '16/03', count: 2 },
    { date: '17/03', count: 7 },
    { date: '18/03', count: 4 },
    { date: '19/03', count: 6 },
    { date: '20/03', count: 3 },
  ];

  // Find the maximum value for scaling
  const maxCount = Math.max(...bookingData.map(item => item.count));

  const handleDownload = (format) => {
    alert(`Downloading report in ${format} format...`);
  };

  return (
    <div className="URP-usage-report-page">
      <Headermanager />

      <main className="URP-main-content">
        <h2 className="URP-page-title">Báo cáo sử dụng</h2>

        <div className="URP-report-filter">
          <div className="URP-date-range">
            <div className="URP-date-box">
              <label>Từ ngày</label>
              <input
                type="text"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                readOnly
              />
            </div>
            <div className="URP-date-box">
              <label>Đến ngày</label>
              <input
                type="text"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                readOnly
              />
            </div>
            <div className="URP-room-info">{roomName}</div>
          </div>
        </div>

        <div className="URP-report-content">
          <div className="URP-user-list">
            <h3>Người đặt phòng</h3>
            {bookings.map(booking => (
              <div className="URP-user-item" key={booking.id}>
                <FaUser className="URP-user-icon" />
                <div className="URP-user-details">
                  <p className="URP-user-name">{booking.user}</p>
                  <p className="URP-user-email">{booking.email}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="URP-booking-graph">
            <h3>Số lượt đặt phòng</h3>
            <div className="URP-graph-container">
              <div className="URP-y-axis">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="URP-y-label">
                    {Math.ceil(maxCount * (5 - i) / 5)}
                  </div>
                ))}
                <div className="URP-y-label">0</div>
              </div>
              <div className="URP-graph">
                {bookingData.map((item, index) => (
                  <div key={index} className="URP-bar-container">
                    <div 
                      className="URP-bar" 
                      style={{ 
                        height: `${(item.count / maxCount) * 100}%`,
                        backgroundColor: `rgb(79, 129, ${150 + index * 15})`
                      }}
                    >
                      <span className="URP-bar-value">{item.count}</span>
                    </div>
                    <div className="URP-x-label">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="URP-report-actions">
          <button className="URP-action-btn URP-download-btn pdf" onClick={() => handleDownload('PDF')}>
            Tải đơn (PDF)
          </button>
          <button className="URP-action-btn URP-download-btn excel" onClick={() => handleDownload('Excel')}>
            Tải đơn (Excel)
          </button>
        </div>
      </main>
    </div>
  );
};

export default UsageReportPage;