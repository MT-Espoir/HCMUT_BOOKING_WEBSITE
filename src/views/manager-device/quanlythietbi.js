function toggleDetails(detailsId) {
    const details = document.getElementById(detailsId);
    const icon = details.previousElementSibling.querySelector('.expand-icon');
    if (details.style.display === 'block') {
        details.style.display = 'none';
        icon.textContent = '⬇️';
    } else {
        details.style.display = 'block';
        icon.textContent = '⬆️';
    }
}

function bookRepair() {
    alert('Chuyển đến giao diện đặt lịch sửa cho Phòng T1');
}