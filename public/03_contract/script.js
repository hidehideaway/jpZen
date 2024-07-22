//実際はAPIで引用する
const contractData = {
    '0000001': [
        {'name': '田中太郎', 'insName': '田中花子', 'plan':'養老保険', 'specialPlan':'入院一時金'},
        {'name': '田中太郎', 'insName': '田中次郎','plan':'養老保険', 'specialPlan':'医療・高度障害'},
        {'name': '田中太郎', 'insName': '田中桃子','plan':'医療保険', 'specialPlan':'先進医療・特定疾病'},
    ],
    '0000002': [
        {'name': '佐藤 一郎', 'insName': 'P345','plan':'終身保険', 'specialPlan':'特定疾病保障・配偶者保障'},
        {'name': '佐藤 一郎', 'insName': 'P456','plan':'定期保険', 'specialPlan':'先進医療'},
    ]
};

let currentClientId;
let currentContractIndex = 0;

function fetchContractList() {
    currentClientId = new URLSearchParams(window.location.search).get('clientId');
    console.log('Fetching contract list for client ID:', currentClientId);

    if (!currentClientId) {
        console.error('No client ID provided');
        return;
    }

    displayContract();
}

function displayContract() {
    const contracts = contractData[currentClientId] || [];
    if (contracts.length === 0) {
        document.getElementById('message').textContent = '該当する契約が見つかりません。';
        document.getElementById('contractTitle').textContent = '';
        document.getElementById('contractTable').innerHTML = '';
        return;
    }

    const contract = contracts[currentContractIndex];
//    document.getElementById('message').textContent = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    document.getElementById('contractTitle').textContent = ``;

    const table = document.getElementById('contractTable');
    table.innerHTML = `
        <tr><td>契約者氏名</td><td>${contract.name}</td></tr>
        <tr><td>被保険者氏名</td><td>${contract.insName}</td></tr>
        <tr><td>契約種類</td><td>${contract.plan}</td></tr>
        <tr><td>特約種類</td><td>${contract.specialPlan}</td></tr>
    `;
}

function nextContract() {
    const contracts = contractData[currentClientId] || [];
    currentContractIndex = (currentContractIndex + 1) % contracts.length;
    displayContract();
}

function closeContract() {
    window.parent.postMessage('navigateToTop', '*');
}

document.addEventListener('DOMContentLoaded', fetchContractList);