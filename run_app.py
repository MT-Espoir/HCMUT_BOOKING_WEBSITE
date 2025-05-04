import subprocess
import os
import sys
import signal
import time

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
                print(f"Lỗi: {e}")
                print("Đang tạo container Redis mới...")
                try:
                    subprocess.run([
                        "docker", "run", "-d", "--name", "redis",
                        "-p", "6379:6379", "redis"
                    ], check=True)
                except subprocess.CalledProcessError as e:
                    print(f"Lỗi khi tạo container Redis: {e}")
                    subprocess.run(["docker", "rm", "redis"], check=False)
                    try:
                        subprocess.run([
                            "docker", "run", "-d", "--name", "redis",
                            "-p", "6379:6379", "redis"
                        ], check=True)
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
                return False
        print("Container Redis đã sẵn sàng.")
    else:
        print("Container Redis đã chạy.")
    
    time.sleep(3)
    return True

def main():
    print("Starting the CNPM Application...")
    print("=" * 50)
    
    # Check if Docker is running
    print("Kiểm tra Docker...")
    if not check_docker_running():
        print("Docker không chạy. Vui lòng khởi động Docker và thử lại.")
        return
    
    # Start Redis container
    if not start_redis_container():
        print("Không thể khởi động Redis. Ứng dụng sẽ không thể hoạt động đúng.")
        choice = input("Bạn có muốn tiếp tục mà không có Redis không? (y/n): ")
        if choice.lower() != 'y':
            return
    
    # Get the current directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, 'backend')
    frontend_dir = base_dir 
    
    if os.name == 'nt': 
        backend_cmd = 'cd "{}" && npm run server'.format(backend_dir)
        frontend_cmd = 'cd "{}" && npm start'.format(frontend_dir)
    else:
        backend_cmd = 'cd "{}" && npm run server'.format(backend_dir)
        frontend_cmd = 'cd "{}" && npm start'.format(frontend_dir)
    
    print("Starting backend server...")
    backend_process = subprocess.Popen(backend_cmd, shell=True)
    
    time.sleep(3)
    
    print("Starting frontend application...")
    frontend_process = subprocess.Popen(frontend_cmd, shell=True)
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down the application...")
        
        # Terminate processes
        if os.name == 'nt':  # Windows
            os.system("taskkill /F /T /PID {}".format(backend_process.pid))
            os.system("taskkill /F /T /PID {}".format(frontend_process.pid))
        else:
            backend_process.send_signal(signal.SIGTERM)
            frontend_process.send_signal(signal.SIGTERM)

        backend_process.wait()
        frontend_process.wait()
        
        print("Application shutdown complete.")

if __name__ == "__main__":
    main()