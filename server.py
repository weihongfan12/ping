from flask import Flask, request, jsonify
import subprocess
import re
import platform

app = Flask(__name__)

@app.route('/ping', methods=['POST'])
def ping_test():
    data = request.json
    ip = data.get('ip')
    if not ip:
        return jsonify({"status": "error", "message": "IP address required"}), 400

    try:
        # 跨平台Ping命令（Windows用'-n'，Linux/Mac用'-c'）
        count = '4'
        command = ['ping', '-n', count, '-w', '2', ip] if platform.system().lower() == 'windows' else ['ping', '-c', count, '-W', '2', ip]
        
        output = subprocess.run(command, capture_output=True, text=True, timeout=10)
        
        if output.returncode == 0:
            # 解析延迟和丢包率
            packet_loss = re.search(r'(\d+)% packet loss', output.stdout)
            avg_delay = re.search(r'= \d+\.\d+/(\d+\.\d+)/', output.stdout)
            
            return jsonify({
                "status": "success",
                "packet_loss": packet_loss.group(1) if packet_loss else "0",
                "avg_delay": avg_delay.group(1) if avg_delay else "0"
            })
        else:
            return jsonify({"status": "failed", "packet_loss": "100", "avg_delay": None})
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
