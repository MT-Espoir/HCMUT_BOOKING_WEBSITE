import subprocess
import os
import sys
import signal
import time
import psutil

def check_docker_running():
    """Check if Docker is running"""
    try:
        result = subprocess.run(["docker", "info"], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        print("Docker không được cài đặt hoặc không nằm trong PATH.")
        return False

def start_redis_container():
    """Start Redis container if not already running"""
    # Check if redis container is running
    result = subprocess.run(
        ["docker", "ps", "--filter", "name=redis", "--format", "{{.Names}}"],
        capture_output=True, 
        text=True
    )
    
    if "redis" not in result.stdout:
        # Check if container exists but stopped
        result = subprocess.run(
            ["docker", "ps", "-a", "--filter", "name=redis", "--format", "{{.Names}}"],
            capture_output=True,
            text=True
        )
        
        if "redis" in result.stdout:
            print("Đang khởi động lại container Redis...")
            try:
                subprocess.run(["docker", "start", "redis"], check=True)
                print("Container Redis đã khởi động lại thành công.")
            except subprocess.CalledProcessError as e:
                print(f"Lỗi khi khởi động lại container Redis: {e}")
                print("Đang tạo container Redis mới...")
                try:
                    subprocess.run([
                        "docker", "run", "-d", "--name", "redis",
                        "-p", "6379:6379", "redis"
                    ], check=True)
                    print("Container Redis đã được tạo thành công.")
                except subprocess.CalledProcessError as e:
                    print(f"Lỗi khi tạo container Redis: {e}")
                    print("Thử gỡ bỏ container cũ trước khi tạo mới...")
                    subprocess.run(["docker", "rm", "redis"], check=False)
                    try:
                        subprocess.run([
                            "docker", "run", "-d", "--name", "redis",
                            "-p", "6379:6379", "redis"
                        ], check=True)
                        print("Container Redis đã được tạo thành công sau khi gỡ bỏ container cũ.")
                    except subprocess.CalledProcessError as e2:
                        print(f"Vẫn không thể tạo container Redis: {e2}")
                        print("Hãy thử khởi động lại Docker hoặc chạy lệnh sau thủ công:")
                        print("docker run -d --name redis -p 6379:6379 redis")
                        return False
        else:
            print("Đang tạo container Redis mới...")
            try:
                subprocess.run([
                    "docker", "run", "-d", "--name", "redis",
                    "-p", "6379:6379", "redis"
                ], check=True)
                print("Container Redis đã được tạo thành công.")
            except subprocess.CalledProcessError as e:
                print(f"Lỗi khi tạo container Redis: {e}")
                print("Hãy thử khởi động lại Docker hoặc chạy lệnh sau thủ công:")
                print("docker run -d --name redis -p 6379:6379 redis")
                return False
            
        print("Container Redis đã sẵn sàng.")
    else:
        print("Container Redis đã chạy rồi.")
    
    # Allow Redis to fully initialize
    print("Đợi Redis khởi động hoàn tất...")
    time.sleep(3)
    return True

def find_nodejs_process():
    """Find and return the Node.js process running the backend server."""
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            # Look for Node.js processes running server.js
            if proc.info['name'] and 'node' in proc.info['name'].lower():
                cmdline = proc.info['cmdline']
                if cmdline and any('server.js' in cmd for cmd in cmdline if cmd):
                    return proc.pid
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return None

def is_backend_running():
    """Check if the backend server is running."""
    return find_nodejs_process() is not None

def start_backend(backend_dir):
    """Start backend server and return the process."""
    print("\nĐang khởi động backend server...")
    
    if os.name == 'nt':  # Windows
        backend_cmd = f'cd "{backend_dir}" && npm run server'
    else:  # Linux/Mac
        backend_cmd = f'cd "{backend_dir}" && npm run server'
    
    try:
        # Start the new process
        process = subprocess.Popen(backend_cmd, shell=True)
        # Wait a moment to ensure the process started correctly
        time.sleep(2)
        
        # Verify the process actually started
        if process.poll() is None:  # None means the process is still running
            return process
        else:
            print(f"Backend không khởi động được. Mã lỗi: {process.returncode}")
            return None
    except Exception as e:
        print(f"Lỗi khi khởi động backend: {e}")
        return None

def monitor_backend():
    """Monitor backend and automatically restart it if it goes down."""
    print("Bắt đầu giám sát backend...")
    
    # Check if Docker is running
    print("Kiểm tra Docker...")
    if not check_docker_running():
        print("Docker không chạy. Vui lòng khởi động Docker và thử lại.")
        return
    
    # Start Redis container
    print("Kiểm tra và khởi động Redis...")
    if not start_redis_container():
        print("Không thể khởi động Redis. Ứng dụng sẽ không thể hoạt động đúng.")
        choice = input("Bạn có muốn tiếp tục mà không có Redis không? (y/n): ")
        if choice.lower() != 'y':
            return
    
    # Get the base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, 'backend')
    
    # Start backend initially
    process = start_backend(backend_dir)
    if not process:
        print("Không thể khởi động backend. Vui lòng kiểm tra lỗi và thử lại.")
        return

    print(f"Backend đang chạy với PID: {process.pid}")
    print("Đang giám sát backend. Nhấn Ctrl+C để dừng giám sát.")
    
    try:
        # Monitor the backend
        while True:
            # Check if backend is still running
            if not is_backend_running():
                print("\nPhát hiện backend đã tắt. Đang khởi động lại...")
                process = start_backend(backend_dir)
                if process:
                    print(f"Backend đã được khởi động lại với PID: {process.pid}")
                else:
                    print("Không thể khởi động lại backend. Đang thử lại sau 10 giây...")
            
            # Wait before next check
            time.sleep(5)
            
    except KeyboardInterrupt:
        print("\nĐang dừng giám sát và tắt backend...")
        if is_backend_running():
            pid = find_nodejs_process()
            if pid:
                if os.name == 'nt':  # Windows
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True)
                else:
                    os.kill(pid, signal.SIGTERM)
        print("Backend đã được dừng. Giám sát kết thúc.")

def restart_backend():
    """Kill the existing Node.js server process and start a new one."""
    print("Looking for running backend server...")
    
    # Check if Docker is running
    print("Kiểm tra Docker...")
    if not check_docker_running():
        print("Docker không chạy. Vui lòng khởi động Docker và thử lại.")
        return
    
    # Start Redis container
    print("Kiểm tra và khởi động Redis...")
    if not start_redis_container():
        print("Không thể khởi động Redis. Ứng dụng sẽ không thể hoạt động đúng.")
        choice = input("Bạn có muốn tiếp tục mà không có Redis không? (y/n): ")
        if choice.lower() != 'y':
            return
    
    # Get the base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, 'backend')
    
    # Find and kill existing Node.js process
    pid = find_nodejs_process()
    if pid:
        print(f"Found backend server process (PID: {pid}). Terminating...")
        try:
            if os.name == 'nt':  # Windows
                subprocess.run(f"taskkill /F /PID {pid}", shell=True)
            else:
                os.kill(pid, signal.SIGTERM)
                # Wait a moment for the process to terminate
                time.sleep(1)
            print("Backend server terminated successfully.")
        except Exception as e:
            print(f"Error terminating server: {e}")
    else:
        print("No running backend server found.")
    
    # Start a new server using the shared function
    process = start_backend(backend_dir)
    
    if process:
        print(f"Backend server restarted with PID: {process.pid}")
        print("Backend server is now running. Press Ctrl+C to exit.")
        
        try:
            # Keep the terminal open
            process.wait()
        except KeyboardInterrupt:
            print("\nStopping backend server...")
            if os.name == 'nt':  # Windows
                subprocess.run(f"taskkill /F /PID {process.pid}", shell=True)
            else:
                process.send_signal(signal.SIGTERM)
                process.wait()
            print("Backend server stopped.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == '--monitor':
        monitor_backend()
    else:
        restart_backend()
        print("\nĐể bật chế độ giám sát tự động (tự động kết nối lại khi backend tắt),")
        print("vui lòng chạy lại script với tham số --monitor:")
        print("python reload_backend.py --monitor")