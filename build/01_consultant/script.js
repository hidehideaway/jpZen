const employeeData = {
    'KMP_01': {'name': '平野', 'position': 'マネージャー'},
    'KMP_02': {'name': '鈴木', 'position': 'リーダー'},
    'KMP_03': {'name': '齋藤', 'position': 'リーダー'},
    'KMP_04': {'name': '三島', 'position': 'スタッフ'}
};

function login(event) {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ
    const loginId = document.getElementById('loginId').value;
    const password = document.getElementById('password').value;
    console.log('Login ID', loginId);
    const employee = employeeData[loginId];

    if (employee && password === '0000') {
        console.log('Employee found:', employee);
        navigateToClientList(loginId);
    } else {
        console.log('No employee found or incorrect password');
        alert('ログインIDまたはパスワードが正しくありません。');
    }
}

function navigateToClientList(loginId) {
    console.log('Navigating to client list with consultant ID:', loginId);
    window.parent.postMessage({ type: 'navigateToClientList', loginId: loginId }, '*');
}

// ページ読み込み時にログインフォームにイベントリスナーを追加
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    } else {
        console.error('Login form not found');
    }
});