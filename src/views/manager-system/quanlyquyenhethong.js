const users = {
    student: [
        { id: 1, name: 'Sinh viên 1', email: 'sv1@gmail.com', role: 'student' },
        { id: 2, name: 'Sinh viên 2', email: 'sv2@gmail.com', role: 'student' }
    ],
    admin: [
        { id: 3, name: 'Quản lý 1', email: 'admin1@gmail.com', role: 'admin' }
    ],
    it: [
        { id: 4, name: 'IT 1', email: 'it1@gmail.com', role: 'it' }
    ],
    technician: [
        { id: 5, name: 'Kỹ thuật 1', email: 'kt1@gmail.com', role: 'technician' }
    ]
};

const histories = {};

let selectedUser = null;
let selectedRole = '';

function loadUsers(role, btn) {
    document.querySelectorAll('.role-buttons button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const list = users[role] || [];
    const userList = document.getElementById('user-list');
    userList.innerHTML = list.map(u => `
        <div class="user-item" id="user-${u.id}" onclick="selectUser(${u.id}, '${u.role}', this)">
            <div class="left-info">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/HCMUT_official_logo.png" alt="Avatar">
                <div class="info">
                    <div class="name">${u.name}</div>
                    <div class="email">${u.email}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function selectUser(id, role, element) {
    document.querySelectorAll('.user-list .user-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    selectedUser = id;
    selectedRole = role;

    element.querySelectorAll('.change-role, .confirm-btn').forEach(e => e.remove());

    const infoArea = element.querySelector('.info');

    const actions = document.createElement('div');
    actions.className = 'change-role';
    ['student', 'admin', 'it', 'technician'].forEach(r => {
        const btn = document.createElement('button');
        btn.textContent = convertRole(r);
        if (r === role) btn.classList.add('selected');
        btn.onclick = (e) => {
            e.stopPropagation();
            actions.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedRole = r;
        };
        actions.appendChild(btn);
    });
    infoArea.appendChild(actions);

    const confirmBtn = document.createElement('button');
    confirmBtn.className = 'confirm-btn';
    confirmBtn.textContent = 'Thay đổi';
    confirmBtn.onclick = (e) => {
        e.stopPropagation();
        if (!histories[id]) histories[id] = [];
        histories[id].push({
            title: convertRole(selectedRole),
            time: new Date().toLocaleString(),
            status: 'Thay đổi chức vụ',
            note: 'Cập nhật bởi Admin'
        });
        alert('Đã thay đổi chức vụ thành: ' + convertRole(selectedRole));
        loadHistory(id);
    };
    element.appendChild(confirmBtn);
}

function convertRole(r) {
    return r === 'student' ? 'Sinh viên' : r === 'admin' ? 'Quản lý HT' : r === 'it' ? 'Nhân viên IT' : 'Nhân viên KT';
}

function loadHistoryUsers() {
    const userArea = document.getElementById('history-users');
    const allUsers = [...users.student, ...users.admin, ...users.it, ...users.technician];
    userArea.innerHTML = allUsers.map(u => `
        <div class="user-item" id="history-user-${u.id}" onclick="selectHistoryUser(${u.id}, this)">
            <div class="left-info">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/60/HCMUT_official_logo.png" alt="Avatar">
                <div class="info">
                    <div class="name">${u.name}</div>
                    <div class="email">${u.email}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function selectHistoryUser(id, element) {
    document.querySelectorAll('#history-users .user-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
    loadHistory(id);
}

function loadHistory(id) {
    const data = histories[id] || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = data.length ? data.map(h => `
        <div class="history-item">
            <p class="title"><strong>Chức vụ:</strong> ${h.title}</p>
            <p><strong>Thời gian:</strong> ${h.time}</p>
            <p><strong>Trạng thái:</strong> ${h.status}</p>
            <p><strong>Ghi chú:</strong> ${h.note}</p>
        </div>
    `).join('') : '<p>Chưa có lịch sử</p>';
}

window.onload = () => {
    loadUsers('student', document.querySelector('.role-buttons button.active'));
    loadHistoryUsers();
};