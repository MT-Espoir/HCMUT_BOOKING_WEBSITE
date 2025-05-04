import React, { useEffect } from 'react';
import './about.css';
import { 
  FaCloud, FaChartLine, FaFileAlt, FaUserCheck, FaChartBar, 
  FaSearch, FaClock, FaLock, FaBell, FaCalendarAlt, FaStar 
} from 'react-icons/fa';
import studentImage from '../../assets/student-booking.jpg';
import studentImage2 from '../../assets/room-side2.jpg';
import teacherImage from '../../assets/teacher.jpg';
import ManagerImage from '../../assets/manager.jpg';
import logo from '../../assets/logo.png';
const About = () => {
  // JavaScript để xử lý chuyển tab - được di chuyển vào useEffect
  useEffect(() => {
    const tabBtns = document.querySelectorAll('.Atab-btn');
    const tabContents = document.querySelectorAll('.Atab-content');
    
    const handleTabClick = (btn) => {
      const tabId = btn.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('Aactive'));
      tabContents.forEach(c => c.classList.remove('Aactive'));
      
      // Add active class to current button and content
      btn.classList.add('Aactive');
      document.getElementById(tabId).classList.add('Aactive');
    };
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => handleTabClick(btn));
    });
    
    // Cleanup event listeners on unmount
    return () => {
      tabBtns.forEach(btn => {
        btn.removeEventListener('click', () => handleTabClick(btn));
      });
    };
  }, []);

  return (
    <div className="Aabout-container">
      {/* 1. Hero Section */}
      <section className="Ahero-section">
        <div className="Ahero-overlay">
          <div className="Ahero-content">
            <h1>Hệ thống Đặt Phòng Học Trực Tuyến</h1>
            <p className="Aslogan">Tối ưu không gian học tập - Nâng cao trải nghiệm giáo dục</p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="Abreadcrumb">
        <span>Trang chủ</span> &gt; <span className="Aactive">Giới thiệu</span>
      </div>

      {/* 2. Giới thiệu Hệ thống */}
      <section className="Aintro-section">
        <div className="Acontainer">
          <h2>Về Hệ Thống Đặt Phòng</h2>
          <div className="Aintro-content">
            <div className="Aintro-text">
              <p>
                Hệ thống đặt phòng học trực tuyến của Đại học Bách Khoa TP.HCM ra đời năm 2025, giúp sinh viên và giảng viên dễ dàng tìm kiếm, đăng ký và quản lý việc sử dụng các phòng học, phòng thí nghiệm và phòng chức năng tại trường. Giao diện đơn giản, thông minh, hỗ trợ tối ưu hóa việc sử dụng cơ sở vật chất một cách hiệu quả và minh bạch.
              </p>
              <p>
                Hệ thống được phát triển bởi Trung tâm Công nghệ Thông tin của trường với sự đóng góp từ các sinh viên xuất sắc của Khoa Khoa học và Kỹ thuật Máy tính, nhằm chuyển đổi số quy trình quản lý phòng học truyền thống, hướng tới một môi trường học tập hiện đại và tiện lợi cho cộng đồng Bách Khoa.
              </p>
            </div>
            <div className="Aintro-image">
              <img src={studentImage} alt="Sinh viên đang sử dụng hệ thống đặt phòng" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mục tiêu phát triển */}
      <section className="Agoals-section">
        <div className="Acontainer">
          <h2>Mục tiêu phát triển</h2>
          <div className="Agoals-grid">
            <div className="Agoal-card">
              <div className="Agoal-icon"><FaCloud /></div>
              <h3>Số hóa quy trình</h3>
              <p>Chuyển đổi hoàn toàn quy trình đặt phòng từ thủ công sang số hóa, tiết kiệm thời gian và nguồn lực.</p>
            </div>
            <div className="Agoal-card">
              <div className="Agoal-icon"><FaChartLine /></div>
              <h3>Tối ưu sử dụng</h3>
              <p>Tăng tỷ lệ sử dụng phòng học hiệu quả lên 40% so với trước đây, giảm thiểu tình trạng phòng trống không được sử dụng.</p>
            </div>
            <div className="Agoal-card">
              <div className="Agoal-icon"><FaFileAlt /></div>
              <h3>Minh bạch thông tin</h3>
              <p>Cung cấp thông tin rõ ràng về tình trạng, trang thiết bị của từng phòng học, giúp người dùng lựa chọn phù hợp nhất.</p>
            </div>
            <div className="Agoal-card">
              <div className="Agoal-icon"><FaUserCheck /></div>
              <h3>Nâng cao trải nghiệm</h3>
              <p>Giảm thời gian chờ đợi và xung đột lịch trong việc sử dụng phòng học, tạo môi trường học tập liền mạch.</p>
            </div>
            <div className="Agoal-card">
              <div className="Agoal-icon"><FaChartBar /></div>
              <h3>Dữ liệu phân tích</h3>
              <p>Thu thập và phân tích dữ liệu để tối ưu hóa việc sử dụng cơ sở vật chất, hỗ trợ ra quyết định cho nhà trường.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Đối tượng sử dụng */}
      <section className="Ausers-section">
        <div className="Acontainer">
          <h2>Đối tượng sử dụng</h2>
          <div className="Atabs">
            <button className="Atab-btn Aactive" data-tab="students">Sinh viên</button>
            <button className="Atab-btn" data-tab="teachers">Giảng viên</button>
            <button className="Atab-btn" data-tab="managers">Quản lý</button>
          </div>
          <div className="Atab-content Aactive" id="students">
            <div className="Auser-info">
              <div className="Auser-image">
                <img src={studentImage2} alt="Sinh viên đang học nhóm" />
              </div>
              <div className="Auser-details">
                <h3>Dành cho Sinh viên</h3>
                <ul className="Afeature-list">
                  <li>Đăng ký phòng học nhóm, ôn tập, học thêm</li>
                  <li>Tra cứu lịch sử dụng phòng và thiết bị</li>
                  <li>Tìm phòng trống phù hợp với nhu cầu học tập</li>
                  <li>Ưu tiên cho sinh viên năm cuối làm đồ án/luận văn</li>
                  <li>Đánh giá chất lượng phòng sau khi sử dụng</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="Atab-content" id="teachers">
            <div className="Auser-info">
              <div className="Auser-image">
                <img src={teacherImage} alt="Giảng viên đang giảng dạy" />
              </div>
              <div className="Auser-details">
                <h3>Dành cho Giảng viên</h3>
                <ul className="Afeature-list">
                  <li>Đăng ký phòng học bổ sung, phòng thí nghiệm</li>
                  <li>Đặt phòng cho seminar, bảo vệ luận văn</li>
                  <li>Quản lý lịch giảng dạy và lịch trống của phòng</li>
                  <li>Yêu cầu thiết bị đặc biệt cho giảng dạy</li>
                  <li>Xem báo cáo sử dụng phòng của sinh viên</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="Atab-content" id="managers">
            <div className="Auser-info">
              <div className="Auser-image">
                <img src={ManagerImage} alt="Nhân viên quản lý làm việc" />
              </div>
              <div className="Auser-details">
                <h3>Dành cho Quản lý</h3>
                <ul className="Afeature-list">
                  <li>Quản lý toàn bộ lịch sử đặt phòng</li>
                  <li>Duyệt/từ chối yêu cầu đặt phòng đặc biệt</li>
                  <li>Thống kê mức độ sử dụng phòng học</li>
                  <li>Lập kế hoạch bảo trì và nâng cấp cơ sở vật chất</li>
                  <li>Phân quyền và quản lý người dùng</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Các tính năng chính */}
      <section className="Afeatures-section">
        <div className="Acontainer">
          <h2>Các tính năng chính</h2>
          <div className="Afeatures-grid">
            <div className="Afeature-card">
              <div className="Afeature-icon"><FaSearch /></div>
              <h3>Tìm kiếm thông minh</h3>
              <p>Lọc phòng theo thời gian, sức chứa, thiết bị, tòa nhà. Tìm kiếm nhanh chóng phòng phù hợp với nhu cầu của bạn.</p>
            </div>
            <div className="Afeature-card">
              <div className="Afeature-icon"><FaClock /></div>
              <h3>Đặt phòng nhanh chóng</h3>
              <p>Chỉ với 3 bước đơn giản, hoàn tất trong 1 phút. Không cần giấy tờ, không cần đợi phê duyệt cho phòng thông thường.</p>
            </div>
            <div className="Afeature-card">
              <div className="Afeature-icon"><FaLock /></div>
              <h3>Xác thực tự động</h3>
              <p>Tích hợp với hệ thống đăng nhập SSO của trường. Đăng nhập một lần, sử dụng mọi dịch vụ của hệ thống.</p>
            </div>
            <div className="Afeature-card">
              <div className="Afeature-icon"><FaBell /></div>
              <h3>Thông báo thông minh</h3>
              <p>Nhắc nhở qua email/SMS trước giờ sử dụng phòng. Không bỏ lỡ lịch đặt phòng của bạn.</p>
            </div>
            <div className="Afeature-card">
              <div className="Afeature-icon"><FaCalendarAlt /></div>
              <h3>Lịch sử & Quản lý</h3>
              <p>Theo dõi, hủy hoặc điều chỉnh phòng đã đặt. Xem lại lịch sử sử dụng phòng của bạn bất cứ lúc nào.</p>
            </div>
            <div className="Afeature-card">
              <div className="Afeature-icon"><FaStar /></div>
              <h3>Đánh giá phòng học</h3>
              <p>Feedback về chất lượng thiết bị và vệ sinh. Giúp nâng cao chất lượng phòng học cho cộng đồng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Nguyên tắc hoạt động */}
      <section className="Aprinciples-section">
        <div className="Acontainer">
          <h2>Nguyên tắc hoạt động</h2>
          <div className="Aprinciples-list">
            <div className="Aprinciple-item">
              <div className="Aprinciple-number">1</div>
              <div className="Aprinciple-content">
                <h3>Xác thực người dùng</h3>
                <p>Mỗi người dùng cần đăng nhập qua cổng xác thực bằng MSSV/Email @hcmut.edu.vn để đảm bảo tính bảo mật và trách nhiệm.</p>
              </div>
            </div>
            <div className="Aprinciple-item">
              <div className="Aprinciple-number">2</div>
              <div className="Aprinciple-content">
                <h3>Quy định thời gian</h3>
                <p>Đặt phòng tối thiểu 4 giờ trước thời điểm sử dụng, tối đa 2 tuần trước. Giúp cân bằng giữa tính linh hoạt và kế hoạch dài hạn.</p>
              </div>
            </div>
            <div className="Aprinciple-item">
              <div className="Aprinciple-number">3</div>
              <div className="Aprinciple-content">
                <h3>Phân quyền rõ ràng</h3>
                <p>Các phòng đặc biệt (lab nghiên cứu) cần được phê duyệt bởi giảng viên phụ trách. Bảo vệ thiết bị giá trị và đảm bảo mục đích sử dụng phù hợp.</p>
              </div>
            </div>
            <div className="Aprinciple-item">
              <div className="Aprinciple-number">4</div>
              <div className="Aprinciple-content">
                <h3>Chính sách hủy phòng</h3>
                <p>Có thể hủy miễn phí trước 2 giờ, sau đó sẽ bị ghi nhận vào lịch sử. Tôn trọng thời gian và cơ hội của người khác.</p>
              </div>
            </div>
            <div className="Aprinciple-item">
              <div className="Aprinciple-number">5</div>
              <div className="Aprinciple-content">
                <h3>Chế tài vi phạm</h3>
                <p>Người dùng đặt nhưng không sử dụng 3 lần sẽ bị hạn chế quyền trong 2 tuần. Đảm bảo trách nhiệm và hiệu quả sử dụng tài nguyên.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Đơn vị phát triển & bảo trì */}
      <section className="Adevelopment-section">
        <div className="Acontainer">
          <h2>Đơn vị phát triển & bảo trì</h2>
          <div className="Adev-cards">
            <div className="Adev-card">
              <h3>Phát triển</h3>
              <div className="Adev-info">
                <h4>Trung tâm Công nghệ Thông tin, Đại học Bách Khoa TP.HCM</h4>
                <p>Chịu trách nhiệm phát triển, cập nhật và mở rộng tính năng của hệ thống.</p>
                <p className="Acontact">Liên hệ: <a href="mailto:it.center@hcmut.edu.vn">it.center@hcmut.edu.vn</a></p>
              </div>
            </div>
            <div className="Adev-card">
              <h3>Bảo trì kỹ thuật</h3>
              <div className="Adev-info">
                <h4>Đội ngũ IT Support, Phòng Cơ sở vật chất</h4>
                <p>Đảm bảo hệ thống vận hành ổn định, khắc phục sự cố kỹ thuật và bảo trì định kỳ.</p>
                <p className="Acontact">Liên hệ: <a href="mailto:it.support@hcmut.edu.vn">it.support@hcmut.edu.vn</a></p>
              </div>
            </div>
            <div className="Adev-card">
              <h3>Hỗ trợ người dùng</h3>
              <div className="Adev-info">
                <h4>Văn phòng Công tác Sinh viên</h4>
                <p>Hỗ trợ giải đáp thắc mắc, hướng dẫn sử dụng và tiếp nhận phản hồi từ người dùng.</p>
                <p className="Acontact">Liên hệ: <a href="mailto:student.support@hcmut.edu.vn">student.support@hcmut.edu.vn</a></p>
              </div>
            </div>
            <div className="Adev-card">
              <h3>Giám sát & Vận hành</h3>
              <div className="Adev-info">
                <h4>Ban Quản lý Đào tạo</h4>
                <p>Giám sát việc sử dụng hệ thống, đảm bảo tuân thủ quy định và tối ưu hóa quy trình.</p>
                <p className="Acontact">Liên hệ: <a href="mailto:training.dept@hcmut.edu.vn">training.dept@hcmut.edu.vn</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Thông tin liên hệ */}
      <section className="Acontact-section">
        <div className="Acontainer">
          <div className="Acontact-grid">
            <div className="Acontact-info">
              <h2>Thông tin liên hệ</h2>
              <div className="Acontact-details">
                <div className="Acontact-item">
                  <strong>Email:</strong> <a href="mailto:booking.support@hcmut.edu.vn">booking.support@hcmut.edu.vn</a>
                </div>
                <div className="Acontact-item">
                  <strong>Hotline:</strong> 028-1234-5678 (giờ hành chính)
                </div>
                <div className="Acontact-item">
                  <strong>Văn phòng:</strong> Phòng A1-702, Tòa nhà A1, Khu A, Đại học Bách Khoa TP.HCM
                </div>
                <div className="Acontact-item">
                  <strong>Địa chỉ:</strong> 268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM
                </div>
                <div className="Asocial-links">
                  <h3>Mạng xã hội</h3>
                  <div className="Asocial-icons">
                    <a href="#" className="Asocial-icon facebook">Facebook: HCMUT Classroom Booking</a>
                    <a href="#" className="Asocial-icon zalo">Zalo Official: HCMUT Classroom</a>
                    <a href="#" className="Asocial-icon group">Group hỗ trợ: Cộng đồng Đặt phòng HCMUT</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="Acontact-form">
              <h3>Liên hệ nhanh</h3>
              <form>
                <div className="Aform-group">
                  <label htmlFor="name">Họ và tên</label>
                  <input type="text" id="name" placeholder="Nhập họ và tên" required />
                </div>
                <div className="Aform-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Nhập email" required />
                </div>
                <div className="Aform-group">
                  <label htmlFor="subject">Tiêu đề</label>
                  <input type="text" id="subject" placeholder="Nhập tiêu đề" required />
                </div>
                <div className="Aform-group">
                  <label htmlFor="message">Nội dung</label>
                  <textarea id="message" rows="5" placeholder="Nhập nội dung" required></textarea>
                </div>
                <button type="submit" className="Abtn-primary">Gửi tin nhắn</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Call to Action (CTA) */}
      <section className="Acta-section">
        <div className="Acontainer">
          <div className="Acta-content">
            <h5>Sẵn sàng tối ưu hóa trải nghiệm học tập của bạn?</h5>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="Afooter">
        <div className="Acontainer">
          <div className="Afooter-content">
            <div className="Afooter-logo">
              <img src={logo} alt="HCMUT Logo" />
              <div className="Afooter-name">
                <h3>Trường Đại học Bách Khoa - ĐHQG TP.HCM</h3>
                <p>Ho Chi Minh City University of Technology (HCMUT)</p>
              </div>
            </div>
            <div className="Afooter-links">
              <div className="Afooter-col">
                <h4>Liên kết nhanh</h4>
                <ul>
                  <li><a href="/">Trang chủ</a></li>
                  <li><a href="/about" className="Aactive">Giới thiệu</a></li>
                  <li><a href="/search">Tìm phòng</a></li>
                  <li><a href="/guide">Hướng dẫn</a></li>
                </ul>
              </div>
              <div className="Afooter-col">
                <h4>Dành cho</h4>
                <ul>
                  <li><a href="/student">Sinh viên</a></li>
                  <li><a href="/teacher">Giảng viên</a></li>
                  <li><a href="/manager">Quản lý</a></li>
                </ul>
              </div>
              <div className="Afooter-col">
                <h4>Chính sách</h4>
                <ul>
                  <li><a href="/privacy">Quyền riêng tư</a></li>
                  <li><a href="/terms">Điều khoản sử dụng</a></li>
                  <li><a href="/faq">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="Afooter-bottom">
            <p>&copy; {new Date().getFullYear()} Hệ thống Đặt Phòng Học Trực Tuyến - Đại học Bách Khoa TP.HCM</p>
            <p>Website: <a href="https://www.hcmut.edu.vn" target="_blank" rel="noreferrer">https://www.hcmut.edu.vn</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;