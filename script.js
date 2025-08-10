document.getElementById('startTest').addEventListener('click', async () => {
    const ipList = document.getElementById('ipList').value.trim();
    if (!ipList) {
        alert('请输入至少一个IP地址！');
        return;
    }

    const ips = ipList.split('\n').filter(ip => ip.trim());
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = ''; // 清空旧结果

    for (const ip of ips) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ip}</td>
            <td class="status">测试中...</td>
            <td>-</td>
            <td>-</td>
        `;
        resultTable.appendChild(row);

        try {
            const result = await pingTest(ip);
            row.innerHTML = `
                <td>${ip}</td>
                <td class="success">✅ 可用</td>
                <td>${result.avgDelay}ms</td>
                <td>${result.packetLoss}%</td>
            `;
        } catch {
            row.innerHTML = `
                <td>${ip}</td>
                <td class="failed">❌ 不可用</td>
                <td>-</td>
                <td>-</td>
            `;
        }
    }
});

// 模拟Ping测试（实际需替换为真实API）
function pingTest(ip) {
    return new Promise((resolve, reject) => {
        // 模拟网络请求延迟
        setTimeout(() => {
            if (Math.random() > 0.3) { // 模拟70%成功率
                resolve({
                    avgDelay: Math.floor(Math.random() * 100) + 10,
                    packetLoss: Math.floor(Math.random() * 10)
                });
            } else {
                reject();
            }
        }, 1000);
    });
}
