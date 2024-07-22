const clientData = {
    'KMP_01': [
        {'policyNum': '12-34-5678901', 'name': '田中 太郎', 'address': '東京都 荒川区 町屋 3-9-2', 'proposal': '提案', 'visitTime': '10:00 から 10:30まで'},
        {'policyNum': '12-34-5678902', 'name': '佐藤 一郎', 'address': '東京都 世田谷区 上馬 1-8-7', 'proposal': '申込', 'visitTime': '11:30 から 12:00 まで'},
        {'policyNum': '12-34-5678903', 'name': '中村 四郎', 'address': '東京都 墨田区 両国 4-8-10 まで', 'proposal': '情報収集・ニーズ喚起・意向把握', 'visitTime': '13:00 から 13:30 まで'},
        {'policyNum': '12-34-5678904', 'name': '伊藤 五郎', 'address': '東京都 江戸川区 東小松川 3-8-5', 'proposal': 'ご契約内容確認活動', 'visitTime': '14:30 から 15:00 まで'},
        {'policyNum': '12-34-5678905', 'name': '渡辺 六郎', 'address': '東京都 板橋区 高島平 5-4-7', 'proposal': 'その他', 'visitTime': '16:00 から 16:30 まで'}
    ],
    'KMP_02': [
        {'policyNum': '12-34-5678906', 'name': '鈴木 二郎', 'address': '東京都 大田区 蒲田 4-1-2', 'proposal': '情報収集・ニーズ喚起・意向把握', 'visitTime': '10:00 から 10:30 まで'},
        {'policyNum': '12-34-5678907', 'name': '田中 四郎', 'address': '東京都 豊島区 池袋本町 1-7-2', 'proposal': '提案', 'visitTime': '11:30 から 12:00 まで'},
        {'policyNum': '12-34-5678908', 'name': '中村 八郎', 'address': '東京都 葛飾区 青戸 1-1-2', 'proposal': '提案', 'visitTime': '13:00 から 13:30 まで'},
        {'policyNum': '12-34-5678909', 'name': '小林 九郎', 'address': '東京都 荒川区 町屋 3-9-2', 'proposal': 'ご契約内容確認活動', 'visitTime': '14:30 から 15:00 まで'},
        {'policyNum': '12-34-56789010 まで', 'name': '佐藤 一郎', 'address': '東京都 板橋区 高島平 5-4-7', 'proposal': 'ご契約内容確認活動', 'visitTime': '16:00 から 16:30 まで'}
    ],
    'KMP_03': [
        {'policyNum': '12-34-5678911', 'name': '山本 七郎', 'address': '東京都 世田谷区 上馬 1-8-7', 'proposal': '提案', 'visitTime': '10:00 から 10:30 まで'},
        {'policyNum': '12-34-5678912', 'name': '伊藤 五郎', 'address': '東京都 目黒区 青葉台 3-2-5', 'proposal': '提案', 'visitTime': '11:30 から 12:00 まで'},
        {'policyNum': '12-34-5678913', 'name': '加藤 十郎', 'address': '東京都 渋谷区 恵比寿 2-3-4', 'proposal': '提案', 'visitTime': '13:00 から 13:30 まで'},
        {'policyNum': '12-34-5678914', 'name': '渡辺 六郎', 'address': '東京都 墨田区 両国 4-8-10 まで', 'proposal': 'ご契約内容確認活動', 'visitTime': '14:30 から 15:00 まで'},
        {'policyNum': '12-34-5678915', 'name': '高橋 三郎', 'address': '東京都 江戸川区 東小松川 3-8-5', 'proposal': 'ご契約内容確認活動', 'visitTime': '16:00 から 16:30 まで'}
    ],
    'KMP_04': [
        {'policyNum': '12-34-5678916', 'name': '佐藤 一郎', 'address': '東京都 北区 王子 2-5-1', 'proposal': '提案', 'visitTime': '10:00 から 10:30 まで'},
        {'policyNum': '12-34-5678917', 'name': '高橋 三郎', 'address': '東京都 中野区 中野 3-6-8', 'proposal': '提案', 'visitTime': '11:30 から 12:00 まで'},
        {'policyNum': '12-34-5678918', 'name': '伊藤 五郎', 'address': '東京都 新宿区 西新宿 6-5-1', 'proposal': '提案', 'visitTime': '13:00 から 13:30 まで'},
        {'policyNum': '12-34-5678919', 'name': '田中 四郎', 'address': '東京都 渋谷区 恵比寿 2-3-4', 'proposal': 'ご契約内容確認活動', 'visitTime': '14:30 から 15:00 まで'},
        {'policyNum': '12-34-5678920 まで', 'name': '鈴木 二郎', 'address': '東京都 豊島区 池袋本町 1-7-2', 'proposal': 'ご契約内容確認活動', 'visitTime': '16:00 から 16:30 まで'}
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
           
            const referConCell = document.createElement('td');
            const referContButton = document.createElement('button');
            referContButton.textContent = '参照';
            referContButton.className = 'btn_1';
            referContButton.onclick = () => navigateToContract(client.policyNum);
            referConCell.appendChild(referContButton);
            
            const referFamCell = document.createElement('td');
            const referFamButton = document.createElement('button');
            referFamButton.textContent = '参照';
            referFamButton.className = 'btn_2';
            referFamButton.onclick = () => navigateToRelativeList(client.name);
            referFamCell.appendChild(referFamButton);

            const registerCell = document.createElement('td');
            const registerButton = document.createElement('button');
            registerButton.textContent = '登録';
            registerButton.className = 'btn_2';
            registerButton.onclick = () => navigateToRegister(client.policyNum);
            registerCell.appendChild(registerButton);

            row.appendChild(policyNumCell);
            row.appendChild(nameCell);
            row.appendChild(addressCell);
            row.appendChild(proposalCell);
            row.appendChild(visitTimeCell);
            row.appendChild(referConCell);
            row.appendChild(referFamCell);
            row.appendChild(registerCell);
            
            clientTableBody.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 7;
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

function setDefaultVisitDate() {
    const dateInput = document.getElementById('visitDate');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    dateInput.value = formattedDate;
    console.log('The default visit date is set to;', formattedDate);
    // 今日の日付をデフォルトの訪問日として入力する
    window.parent.postMessage({type: 'setVisitDate', date:formattedDate}, '*');
}

function logout() {
    console.log('Logging out');
    // ここでログアウト処理を実装する
}

// ページ読み込み時に顧客一覧を取得
document.addEventListener('DOMContentLoaded', () => {
    fetchClientList();
    
    setDefaultVisitDate();  //デフォルトの訪問日取得

    const dateButton = document.getElementById('dateButton');
    dateButton.addEventListener('click', setVisitDate);
    
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);
});