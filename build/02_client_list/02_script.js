const clientData = {
        'KMP_01': [
            {'policyNum': '0000001', 'name': '田中 太郎', 'address': '東京都 荒川区 町屋 3-9-2', 'proposal': 'PlanA', 'visitTime': '10:00', 'leaveTime': '10:30'},
            {'policyNum': '0000002', 'name': '佐藤 一郎', 'address': '東京都 世田谷区 上馬 1-8-7', 'proposal': 'PlanA', 'visitTime': '11:30', 'leaveTime': '12:00'},
            {'policyNum': '0000003', 'name': '中村 四郎', 'address': '東京都 墨田区 両国 4-8-10', 'proposal': 'PlanA', 'visitTime': '13:00', 'leaveTime': '13:30'},
            {'policyNum': '0000004', 'name': '伊藤 五郎', 'address': '東京都 江戸川区 東小松川 3-8-5', 'proposal': 'PlanB', 'visitTime': '14:30', 'leaveTime': '15:00'},
            {'policyNum': '0000005', 'name': '渡辺 六郎', 'address': '東京都 板橋区 高島平 5-4-7', 'proposal': 'PlanB', 'visitTime': '16:00', 'leaveTime': '16:30'}
        ],
        'KMP_02': [
            {'policyNum': '0000006', 'name': '鈴木 二郎', 'address': '東京都 大田区 蒲田 4-1-2', 'proposal': 'PlanA', 'visitTime': '10:00', 'leaveTime': '10:30'},
            {'policyNum': '0000007', 'name': '田中 四郎', 'address': '東京都 豊島区 池袋本町 1-7-2', 'proposal': 'PlanA', 'visitTime': '11:30', 'leaveTime': '12:00'},
            {'policyNum': '0000008', 'name': '中村 八郎', 'address': '東京都 葛飾区 青戸 1-1-2', 'proposal': 'PlanA', 'visitTime': '13:00', 'leaveTime': '13:30'},
            {'policyNum': '0000009', 'name': '小林 九郎', 'address': '東京都 荒川区 町屋 3-9-2', 'proposal': 'PlanB', 'visitTime': '14:30', 'leaveTime': '15:00'},
            {'policyNum': '00000010', 'name': '佐藤 一郎', 'address': '東京都 板橋区 高島平 5-4-7', 'proposal': 'PlanB', 'visitTime': '16:00', 'leaveTime': '16:30'}
        ],
        'KMP_03': [
            {'policyNum': '0000011', 'name': '山本 七郎', 'address': '東京都 世田谷区 上馬 1-8-7', 'proposal': 'PlanA', 'visitTime': '10:00', 'leaveTime': '10:30'},
            {'policyNum': '0000012', 'name': '伊藤 五郎', 'address': '東京都 目黒区 青葉台 3-2-5', 'proposal': 'PlanA', 'visitTime': '11:30', 'leaveTime': '12:00'},
            {'policyNum': '0000013', 'name': '加藤 十郎', 'address': '東京都 渋谷区 恵比寿 2-3-4', 'proposal': 'PlanA', 'visitTime': '13:00', 'leaveTime': '13:30'},
            {'policyNum': '0000014', 'name': '渡辺 六郎', 'address': '東京都 墨田区 両国 4-8-10', 'proposal': 'PlanB', 'visitTime': '14:30', 'leaveTime': '15:00'},
            {'policyNum': '0000015', 'name': '高橋 三郎', 'address': '東京都 江戸川区 東小松川 3-8-5', 'proposal': 'PlanB', 'visitTime': '16:00', 'leaveTime': '16:30'}
        ],
        'KMP_04': [
            {'policyNum': '0000016', 'name': '佐藤 一郎', 'address': '東京都 北区 王子 2-5-1', 'proposal': 'PlanA', 'visitTime': '10:00', 'leaveTime': '10:30'},
            {'policyNum': '0000017', 'name': '高橋 三郎', 'address': '東京都 中野区 中野 3-6-8', 'proposal': 'PlanA', 'visitTime': '11:30', 'leaveTime': '12:00'},
            {'policyNum': '0000018', 'name': '伊藤 五郎', 'address': '東京都 新宿区 西新宿 6-5-1', 'proposal': 'PlanA', 'visitTime': '13:00', 'leaveTime': '13:30'},
            {'policyNum': '0000019', 'name': '田中 四郎', 'address': '東京都 渋谷区 恵比寿 2-3-4', 'proposal': 'PlanB', 'visitTime': '14:30', 'leaveTime': '15:00'},
            {'policyNum': '0000020', 'name': '鈴木 二郎', 'address': '東京都 豊島区 池袋本町 1-7-2', 'proposal': 'PlanB', 'visitTime': '16:00', 'leaveTime': '16:30'}
        ]
    };

function navigateToContract(clientId) {
    console.log('Navigating to Contract with client ID:', clientId);
    window.parent.postMessage({ type: 'navigateToContract', clientId: clientId }, '*');
}

function navigateToRelativeList(clientName) {
    console.log('Navigating to Relative List for client:', clientName);
    window.parent.postMessage({ type: 'navigateToRelativeList', clientName: clientName }, '*');
}

function navigateToRegister(policyNum) {
    console.log('Navigating to Register for policy number:', policyNum);
    window.parent.postMessage({ type: 'navigateToRegister', policyNum: policyNum }, '*');
}
// ... (既存のコードはそのまま)

function fetchClientList() {
    const consultantId = new URLSearchParams(window.location.search).get('consultantId');
    console.log('Fetching client list for consultant ID:', consultantId);

    if (!consultantId) {
        console.error('No consultant ID provided');
        return;
    }

    const clients = clientData[consultantId] || [];
    console.log('Retrieved clients:', clients);

    const clientTableBody = document.querySelector('#clientTable tbody');
    clientTableBody.innerHTML = '';

    if (clients.length > 0) {
        clients.forEach(client => {
            const row = document.createElement('tr');
            
            const policyNumCell = document.createElement('td');
            policyNumCell.textContent = client.policyNum;
            
            const nameCell = document.createElement('td');
            nameCell.textContent = client.name;
            
            const addressCell = document.createElement('td');
            addressCell.textContent = client.address;
            
            const proposalCell = document.createElement('td');
            proposalCell.textContent = client.proposal;

            const visitTimeCell = document.createElement('td');
            visitTimeCell.textContent = client.visitTime;

            const leaveTimeCell = document.createElement('td');
            leaveTimeCell.textContent = client.leaveTime;
            
            const referConCell = document.createElement('td');
            const referContButton = document.createElement('button');
            referContButton.textContent = '参照';
            referContButton.className = 'btn';
            referContButton.onclick = () => navigateToContract(client.policyNum);
            referConCell.appendChild(referContButton);
            
            const referFamCell = document.createElement('td');
            const referFamButton = document.createElement('button');
            referFamButton.textContent = '参照';
            referFamButton.className = 'btn';
            referFamButton.onclick = () => navigateToRelativeList(client.name);
            referFamCell.appendChild(referFamButton);

            const registerCell = document.createElement('td');
            const registerButton = document.createElement('button');
            registerButton.textContent = '登録';
            registerButton.className = 'btn';
            registerButton.onclick = () => navigateToRegister(client.policyNum);
            registerCell.appendChild(registerButton);

            row.appendChild(policyNumCell);
            row.appendChild(nameCell);
            row.appendChild(addressCell);
            row.appendChild(proposalCell);
            row.appendChild(visitTimeCell);
            row.appendChild(leaveTimeCell);
            row.appendChild(referConCell);
            row.appendChild(referFamCell);
            row.appendChild(registerCell);
            
            clientTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 8;
        cell.textContent = '該当するクライアントが見つかりません。';
        row.appendChild(cell);
        clientTableBody.appendChild(row);
    }
}

function setVisitDate() {
    const dateInput = document.getElementById('visitDate');
    const selectedDate = dateInput.value;
    console.log('Selected visit date:', selectedDate);
    // ここで選択された日付を処理する
}

function logout() {
    console.log('Logging out');
    // ここでログアウト処理を実装する
}

// ページ読み込み時に顧客一覧を取得
document.addEventListener('DOMContentLoaded', () => {
    fetchClientList();
    
    const dateButton = document.getElementById('dateButton');
    dateButton.addEventListener('click', setVisitDate);
    
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);
});