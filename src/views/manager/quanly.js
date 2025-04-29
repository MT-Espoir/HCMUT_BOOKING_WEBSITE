const users = [
    {
        name: "Nguyễn Văn A",
        email: "nva@example.com",
        role: "Sinh viên - 2012345",
        lastLogin: "10:30 27/04/2025",
        status: "Online",
        note: "(Trống)",
        bookings: [
            { roomId: "P101", description: "Phòng họp lớn", time: "15:00-17:00", image: "https://picsum.photos/50/50?1" },
            { roomId: "P102", description: "Phòng học nhóm", time: "12:00-18:00", image: "https://picsum.photos/50/50?2" }
        ]
    },
    {
        name: "Trần Thị B",
        email: "ttb@example.com",
        role: "Sinh viên - 2015678",
        lastLogin: "09:00 26/04/2025",
        status: "Offline",
        note: "(Trống)",
        bookings: []
    },
    {
        name: "Ngô Thị C",
        email: "ntc@example.com",
        role: "Sinh viên - 2019876",
        lastLogin: "11:00 25/04/2025",
        status: "Online",
        note: "(Trống)",
        bookings: []
    },
    {
        name: "Hồ Hoàng D",
        email: "hhd@example.com",
        role: "Sinh viên - 2016543",
        lastLogin: "16:00 24/04/2025",
        status: "Offline",
        note: "(Trống)",
        bookings: []
    },
    {
        name: "Phạm Thế E",
        email: "pte@example.com",
        role: "Sinh viên - 2014321",
        lastLogin: "17:00 23/04/2025",
        status: "Online",
        note: "(Trống)",
        bookings: []
    },
];

function showUserDetails(index) {
    const userItems = document.querySelectorAll('.user-item');
    userItems.forEach(item => item.classList.remove('selected'));
    userItems[index].classList.add('selected');

    const user = users[index];
    const bookingHistory = user.bookings.length > 0 ? user.bookings.map(booking => `
        <div class="booking-item">
            <img src="${booking.image}" alt="Room">
            <div class="info">
                <div class="room-id">${booking.roomId}</div>
                <div class="description">${booking.description}</div>
            </div>
            <div class="time">${booking.time}</div>
        </div>
    `).join('') : '<p>Không có lịch sử đặt phòng</p>';

    document.getElementById('user-details').innerHTML = `
        <div class="header">
            <div class="name">${user.name}</div>
            <div class="email">${user.email}</div>
        </div>
        <div class="info">
            <p><strong>Chức vụ:</strong> ${user.role}</p>
            <p><strong>Lần đăng nhập gần nhất:</strong> ${user.lastLogin}</p>
            <p><strong>Trạng thái:</strong> ${user.status}</p>
            <p><strong>Ghi chú:</strong> ${user.note}</p>
        </div>
        <div class="booking-history">
            <h3>Lịch sử đặt phòng</h3>
            ${bookingHistory}
        </div>
    `;
}

window.onload = () => {
    showUserDetails(0);
};