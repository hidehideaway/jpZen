document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const policyNum = urlParams.get('policyNum');
    console.log('Policy number:', policyNum);

    const childrenData = [
        { name: '田中四郎', description: '20歳男性', relation:'子ども', age:'20', notes:'大学生です' },
        { name: '田中さくら', description: '18歳女性', relation:'子ども', age:'20', notes:'大学生です'  },
        { name: '田中竜馬', description: '15歳男性', relation:'子ども', age:'20', notes:'大学生です'  },
    ];

    const parentsData = [
        { name: '田中美咲', description: '65歳女性', relation:'子ども', age:'65', notes:'涙もろいです'  },
        { name: '田中昭', description: '64歳男性', relation:'子ども', age:'64', notes:'耳が遠いです'  },
        { name: '田中ちよ', description: '71歳女性', relation:'子ども', age:'71', notes:''  },
    ];

    const spouseData = [
        { name: '田中涼子', description: '40歳女性', relation:'妻', age:'40', notes:'倹約家です'  },
        { name: '田中恵', description: '32歳女性', relation:'兄', age:'40', notes:'倹約家です'  },
        { name: '田中里美', description: '44歳女性', relation:'姉', age:'40', notes:'倹約家です'  },
    ];

    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        if (table) {
            data.forEach((item, index) => {
                const row = table.insertRow();
                row.insertCell(0).textContent = item.name;
                row.insertCell(1).textContent = item.description;
                const checkboxCell = row.insertCell(2);
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'checkbox';
                checkboxCell.appendChild(checkbox);
            });
        } else {
            console.error(`Table with id ${tableId} not found`);
        }
    }

    populateTable('childrenTable', childrenData);
    populateTable('parentsTable', parentsData);
    populateTable('spouseTable', spouseData);

    const commitButton = document.getElementById('commitButton');
    if (commitButton) {
        commitButton.addEventListener('click', function() {
            console.log('Commit button clicked');
            const selectedMembers = [];
            const tables = ['childrenTable', 'parentsTable', 'spouseTable'];
            tables.forEach(tableId => {
                const table = document.getElementById(tableId);
                const checkboxes = table.querySelectorAll('input[type="checkbox"]:checked');
                checkboxes.forEach(checkbox => {
                    const name = checkbox.closest('tr').cells[0].textContent;
                    selectedMembers.push(name);
                });
            });
            
            // 選択されたメンバーを親コンポーネントに送信し、画面遷移を要求
            window.parent.postMessage({ 
                type: 'commitAndNavigate', 
                members: selectedMembers 
            }, '*');
        });
    } else {
        console.error('Commit button not found');
    }    
    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            console.log('Close button clicked');
            window.parent.postMessage({ type: 'closeRegister' }, '*');
        });
    } else {
        console.error('Close button not found');
    }

    function getSelectedMembers(tableId) {
        const table = document.getElementById(tableId);
        const selectedMembers = [];
        if (table) {
            const rows = table.getElementsByTagName('tr');
            for (let i = 1; i < rows.length; i++) {
                const checkbox = rows[i].getElementsByClassName('checkbox')[0];
                if (checkbox && checkbox.checked) {
                    selectedMembers.push({
                        name: rows[i].cells[0].textContent,
                        description: rows[i].cells[1].textContent
                    });
                }
            }
        }
        return selectedMembers;
    }
});