const employeeData = {
    'user1': [
        {'name': '平野', 'position': 'マネージャー', 'id':'KMP_01'},
        {'name': '齋藤', 'position': 'リーダー','id':'KMP_03'},
        {'name': '益田', 'position': 'スタッフ','id':'KMP_03'},
        {'name': '三島', 'position': 'スタッフ','id':'KMP_04'}
    ],
    'user2': [
        {'name': '齋藤', 'position': 'リーダー','id':'KMP_03'},
        {'name': '益田', 'position': 'スタッフ','id':'KMP_03'}
    ]
};

function fetchEmployeeList() {
    const loginId = document.getElementById('loginId').value;
    console.log('Login ID',loginId);
    const employees = employeeData[loginId] || [];
    console.log('Employees',employees);

    const employeeTableBody = document.querySelector('#employeeTable tbody');
    employeeTableBody.innerHTML = '';

    if (employees.length > 0) {
        employees.forEach(employee => {
            console.log('Adding employee:',employee);
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = employee.name;
            const positionCell = document.createElement('td');
            positionCell.textContent = employee.position;
            const idCell = document.createElement('td');
            const idLink = document.createElement('a');
            idLink.textContent = employee.id;
            idLink.href = '#';
            idLink.onclick = () => navigateToClientList(employee.id);
            idCell.appendChild(idLink);
            row.appendChild(nameCell);
            row.appendChild(positionCell);
            row.appendChild(idCell);
            employeeTableBody.appendChild(row);
        });
    } else {
        console.log('No eployees found');
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = '該当する従業者が見つかりません。';
        row.appendChild(cell);
        employeeTableBody.appendChild(row);
    }
}

function navigateToClientList(consultantId) {
    window.parent.postMessage({ type: 'navigateToClientList', consultantId: consultantId }, '*');
}

// ページ読み込み時に表示ボタンにイベントリスナーを追加
document.addEventListener('DOMContentLoaded', () => {
    const displayButton = document.getElementById('displayButton');
    displayButton.addEventListener('click', fetchEmployeeList);
});