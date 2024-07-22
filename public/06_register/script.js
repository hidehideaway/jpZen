document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const policyNum = urlParams.get('policyNum');
    console.log('Policy number:', policyNum);

    // 候補者ダミーデータ。本来はAPIでDB処理する
    const originData = [
        { name: '田中太郎', age: 20, relation: '長男', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '大学生です', sex: '男', description:'20歳男性', contract: 0},
        { name: '田中桃子', age: 21, relation: '長女', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '就職活動中です',sex: '女', description:'21歳女性', contract: 0},
        { name: '田中次郎', age: 15, relation: '次男', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '高校受験を控えています',sex: '男', description:'20歳男性', contract: 0},
    ];

    const childrenData = [
        { name: '田中四郎', age: 20, relation: '長男', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '大学生です', sex: '男', description:'20歳男性', contract: 0},
        { name: '田中さくら', age: 21, relation: '長女', postcode: '116-0001', address:'東京都 墨田区 両国 4-8-10', note: '就職活動中です',sex: '女', description:'21歳女性', contract: 0},
        { name: '田中竜馬', age: 15, relation: '次男', postcode: '116-0001', address:'東京都 江戸川区 東小松川 3-8-5', note: '高校受験を控えています',sex: '男', description:'20歳男性', contract: 0},
    ];
    
    const parentsData = [
        { name: '田中美咲', age: 77, relation: '祖母', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '世間話が長いです',sex: '女', description:'65歳女性', contract: 0},
        { name: '田中昭', age: 77, relation: '祖父', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: 'タバコが好きです',sex: '男', description:'65歳男性', contract: 0},
        { name: '田中ちよ', age: 89, relation: '祖母', postcode: '116-0001', address:'東京都 豊島区 池袋本町 1-7-2', note: '世間話が長いです',sex: '女', description:'65歳女性', contract: 0},
    ];
    
    const spouseData = [
        { name: '田中涼子', age: 40, relation: '母', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '倹約家です',sex: '女', description:'22歳女性' },
        { name: '田中恵', age: 32, relation: '母', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '倹約家です',sex: '男', description:'20歳女性' },
        { name: '田中里美', age: 44, relation: '母', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '倹約家です',sex: '女', description:'44歳女性' },
    ];

    const siblingsData = [
        { name: '田中新次郎', age: 40, relation: '弟', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '倹約家です',sex: '女', description:'22歳女性' },
        { name: '田中圭', age: 48, relation: '兄', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '倹約家です',sex: '男', description:'20歳女性' },
        { name: '田中藍子', age: 48, relation: '姉', postcode: '116-0001', address:'東京都 荒川区 町屋 3-9-2', note: '倹約家です',sex: '女', description:'44歳女性' },
    ];

    // 表形式定義
    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        if (table) {
            data.forEach((item, index) => {
                const row = table.insertRow();                  //列の追加
                row.insertCell(0).textContent = item.name;
                row.insertCell(1).textContent = item.age;
                row.insertCell(2).textContent = item.address;
                row.insertCell(3).textContent = item.sex;
                if (tableId !== 'originTable'){
                    const checkboxCell = row.insertCell(4);
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'checkbox';
                    checkboxCell.appendChild(checkbox);                    
                }
            });
        } else {
            console.error(`Table with id ${tableId} not found`);
        }
    }
    // 各セグメントのテーブル定義
    populateTable('originTable', originData);
    populateTable('childrenTable', childrenData);
    populateTable('parentsTable', parentsData);
    populateTable('spouseTable', spouseData);
    populateTable('siblingsTable', siblingsData);

    const commitButton = document.getElementById('commitButton');
    if (commitButton) {
        commitButton.addEventListener('click', function() {
            console.log('Commit button clicked');
            const selectedMembers = [];
            const tables = ['originTable','childrenTable', 'parentsTable', 'spouseTable', 'siblingsTable'];        // 子ども、親、配偶者テーブルを定義
            const allData = [...originData, ...childrenData, ...parentsData, ...spouseData, ...siblingsData];      // 各世帯データを定義

            tables.forEach(tableId => {
                const table = document.getElementById(tableId);
                const checkboxes = table.querySelectorAll('input[type="checkbox"]:checked');
                checkboxes.forEach(checkbox => {
                    const row = checkbox.closest('tr');
                    const name = row.cells[0].textContent;
                    const member = allData.find(m => m.name === name);
                    if (member) {
                        selectedMembers.push({
                            name: member.name,
                            age: member.age,
                            relation: member.relation,
                            address: member.address, 
                            note: member.note,
                            description: member.description,
                            contract: member.contract
                        });
                    }
                });
            });
            
            // 選択されたメンバーを親ウィンドウに送信
            window.parent.postMessage({ 
                type: 'commitAndNavigate', 
                members: selectedMembers 
            }, '*');
        });
    } else {
        console.error('Commit button not found');
    }

    let isOriginTableExpanded = false;

    function toggleOriginTable(expanded){
        isOriginTableExpanded = !isOriginTableExpanded;
        const originTable = document.getElementById('originTable');
        const originTableContainer = document.getElementById('originTableContainer');
        const toggleButton = document.getElementById('toggleOriginTable');
        if (originTable && originTableContainer && toggleButton) {
            if (isOriginTableExpanded) {
                originTableContainer.style.display = 'block'
                toggleButton.textContent = '■ 追加先の世帯情報(非表示にする)';
            } else {
                originTableContainer.style.display = 'none'
                toggleButton.textContent = '■ 追加先の世帯情報(展開する)';
            }
        }
    }

    //初期状態で折りたたみ
    toggleOriginTable(false);

    const toggleButton = document.getElementById('toggleOriginTable');
    if (toggleButton){
        toggleButton.addEventListener('click', toggleOriginTable);
    }

    window.addEventListener('message', function(event) {
        if (event.data.type === 'setOriginTableExpanded') {
            isOriginTableExpanded = event.data.expanded;
            toggleOriginTable(isOriginTableExpanded);
        }
    });

    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            console.log('Close button clicked');
            window.parent.postMessage({ type: 'closeRegister' }, '*');
        });
    } else {
        console.error('Close button not found');
    }
});