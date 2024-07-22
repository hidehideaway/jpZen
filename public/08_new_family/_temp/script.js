(function() {
    const API_BASE_URL = 'http://localhost:8040';

    async function generateFamilyTree(selectedMembers) {
        try {
            console.log('Original selectedMembers:', selectedMembers);
            // サーバ側に渡すデータの正規化
            const formattedMembers = selectedMembers.map(member => ({
                name: member.name,
                age: parseInt(member.age) || 0,         
                relation: member.relation || "不明",
                note: member.note || "hoge",
                description: member.description || "",
                contract: parseInt(member.contract) || 0
            }));
            // ログ生成
            console.log('Formatted members:', formattedMembers);
            console.log('Sending data to server:', JSON.stringify(formattedMembers));
            // サーバ側に正規化データを渡す
            const response = await fetch(`${API_BASE_URL}/generate_family_tree`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedMembers),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            console.log('Received data from the server:', JSON.stringify(data, null, 2));
            console.log('Insurance propsal from the server:', data.insuranceProposal);
            renderFamilyTree(data.family_members, data.insuranceProposal);

            if(!data.insurance_proposal){
                console.error('Insurance proposal is missig in the server response');
                data.insurance_proposal = "保険提案文章を取得できませんでした。";
            }
            renderFamilyTree(data.family_members, data.insurance_proposal);

        } catch (error) {
            console.error('Error generating family tree:', error);
            document.getElementById('familyTree').innerHTML = `<p>家系図の生成中にエラーが発生しました: ${error.message}</p>`;
        }
        
    }
    // 家系図の描画
    function renderFamilyTree(familyMembers, insuranceProposal) {
        const familyTreeElement = document.getElementById('familyTree');
        
        console.log('Rendering family tree with data:', familyMembers);
        console.log('Insurance Proposal:', insuranceProposal);              //20240714追記
        familyTreeElement.innerHTML = '';

        //20240715追記. 提案文章が正しく生成されているかチェック
        if (insuranceProposal){
            //20240714追記
            const proposalElement = document.createElement('div');
            proposalElement.classList.add('insurance-proposal');
            proposalElement.innerHTML = `<h2 style="color: #001096; text-align: center;">更新後の家族構成 - 田中次郎様</h2><p>${insuranceProposal || '提案文章を取得できませんでした'}</p>`;
            familyTreeElement.appendChild(proposalElement);    
        }else{
            console.warn('Insurance proposal is undefined or null')
        }
        // 世代配列の作成
        const generations = [
            familyMembers.filter(p => p.relation === '祖父' || p.relation === '祖母'),
            familyMembers.filter(p => p.relation === '父' || p.relation === '母'),
            familyMembers.filter(p => ['長男', '長女', '次男', '次女'].includes(p.relation))
        ];

        generations.forEach((gen, index) => {
            const genDiv = document.createElement('div');
            genDiv.classList.add('generation');
            gen.forEach(person => {
                const personElement = createPersonElement(person, familyMembers);
                genDiv.appendChild(personElement);
            });
            familyTreeElement.appendChild(genDiv);
        });

        const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgElement.style.position = 'absolute';
        svgElement.style.top = '0';
        svgElement.style.left = '0';
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        svgElement.style.pointerEvents = 'none';
        familyTreeElement.appendChild(svgElement);

        const lines = connectMembers(familyMembers, familyTreeElement);
        lines.forEach(line => {
            const svgLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
            svgLine.setAttribute("x1", line.x1);
            svgLine.setAttribute("y1", line.y1);
            svgLine.setAttribute("x2", line.x2);
            svgLine.setAttribute("y2", line.y2);
            svgLine.setAttribute("stroke", "#001096");
            svgLine.setAttribute("stroke-width", "2");
            svgElement.appendChild(svgLine);
        });
    }

    function connectMembers(familyMembers, containerElement) {
        const containerRect = containerElement.getBoundingClientRect();
        const lines = [];

        const grandfather = familyMembers.find(m => m.relation === '祖父');
        const grandmother = familyMembers.find(m => m.relation === '祖母');
        const father = familyMembers.find(m => m.relation === '父');
        const mother = familyMembers.find(m => m.relation === '母');
        const children = familyMembers.filter(m => ['長男', '長女', '次男', '次女'].includes(m.relation));

        // 祖父母から父への接続
        if ((grandfather || grandmother) && father) {
            const grandfatherElement = grandfather ? document.querySelector(`.person[data-relation="祖父"]`) : null;
            const grandmotherElement = grandmother ? document.querySelector(`.person[data-relation="祖母"]`) : null;
            const fatherElement = document.querySelector(`.person[data-relation="父"]`);

            const grandfatherRect = grandfatherElement ? grandfatherElement.getBoundingClientRect() : null;
            const grandmotherRect = grandmotherElement ? grandmotherElement.getBoundingClientRect() : null;
            const fatherRect = fatherElement.getBoundingClientRect();

            const grandparentsCenterX = grandfatherRect && grandmotherRect
                ? (grandfatherRect.left + grandfatherRect.right + grandmotherRect.left + grandmotherRect.right) / 4 - containerRect.left
                : (grandfatherRect ? grandfatherRect.left + grandfatherRect.width / 2 : grandmotherRect.left + grandmotherRect.width / 2) - containerRect.left;
            
            const grandparentsBottomY = Math.max(
                grandfatherRect ? grandfatherRect.bottom : 0,
                grandmotherRect ? grandmotherRect.bottom : 0
            ) - containerRect.top;

            const fatherTopY = fatherRect.top - containerRect.top;
            const fatherCenterX = fatherRect.left + fatherRect.width / 2 - containerRect.left;

            // 祖父母を繋ぐ線（いる場合）
            if (grandfatherRect && grandmotherRect) {
                lines.push({
                    x1: grandfatherRect.right - containerRect.left,
                    y1: grandfatherRect.top + grandfatherRect.height / 2 - containerRect.top,
                    x2: grandmotherRect.left - containerRect.left,
                    y2: grandmotherRect.top + grandmotherRect.height / 2 - containerRect.top
                });
            }

            // 祖父母から父への縦線
            lines.push({
                x1: grandparentsCenterX,
                y1: grandparentsBottomY,
                x2: grandparentsCenterX,
                y2: (fatherTopY + grandparentsBottomY) / 2
            });

            // 父への横線
            lines.push({
                x1: grandparentsCenterX,
                y1: (fatherTopY + grandparentsBottomY) / 2,
                x2: fatherCenterX,
                y2: (fatherTopY + grandparentsBottomY) / 2
            });

            // 父への縦線
            lines.push({
                x1: fatherCenterX,
                y1: (fatherTopY + grandparentsBottomY) / 2,
                x2: fatherCenterX,
                y2: fatherTopY
            });
        }

        if (father && mother) {
            const fatherElement = document.querySelector(`.person[data-relation="父"]`);
            const motherElement = document.querySelector(`.person[data-relation="母"]`);
            const fatherRect = fatherElement.getBoundingClientRect();
            const motherRect = motherElement.getBoundingClientRect();

            const parentsCenterX = (fatherRect.left + fatherRect.right + motherRect.left + motherRect.right) / 4 - containerRect.left;
            const parentsMiddleY = (fatherRect.top + motherRect.top)/2 + fatherRect.height/2 - containerRect.top
            const parentsBottomY = Math.max(fatherRect.bottom, motherRect.bottom) - containerRect.top;
            

            // 父母を繋ぐ線
            lines.push({
                x1: fatherRect.right - containerRect.left,
                y1: fatherRect.top + fatherRect.height / 2 - containerRect.top,
                x2: motherRect.left - containerRect.left,
                y2: motherRect.top + motherRect.height / 2 - containerRect.top
            });

            if (children.length > 0) {
                const childrenElements = children.map(child => document.querySelector(`.person[data-relation="${child.relation}"]`));
                const childrenRects = childrenElements.map(el => el.getBoundingClientRect());
                const childrenTopY = childrenRects[0].top - containerRect.top;

                // 親から子供への縦線
                lines.push({
                    x1: parentsCenterX,
                    y1: parentsMiddleY,
                    x2: parentsCenterX,
                    y2: (childrenTopY + parentsBottomY) / 2
                });

                // 子供たちへの横線と縦線
                childrenRects.forEach(childRect => {
                    const childCenterX = childRect.left + childRect.width / 2 - containerRect.left;
                    lines.push(
                        {
                            x1: parentsCenterX,
                            y1: (childrenTopY + parentsBottomY) / 2,
                            x2: childCenterX,
                            y2: (childrenTopY + parentsBottomY) / 2
                        },
                        {
                            x1: childCenterX,
                            y1: (childrenTopY + parentsBottomY) / 2,
                            x2: childCenterX,
                            y2: childrenTopY
                        }
                    );
                });
            }
        }

        return lines;
    }

function createPersonElement(person, allMembers) {
    const element = document.createElement('div');
    element.classList.add('person');
    element.setAttribute('data-relation', person.relation);
    
    // ここからバッジの配置を決定している箇所
    let badgeHTML = '';
    if (person.contract === 1) {
        badgeHTML = '<span class="badge contract">契約者</span>';
    } else if (person.contract === 2) {
        badgeHTML = '<span class="badge non-contract">被保険者</span>';
    }
    // ここまでがバッジの配置を決定している箇所
    
    element.innerHTML = `
        ${badgeHTML}
        <h3>${person.name}</h3>
        <p>年齢: ${person.age}</p>
    `;
    element.addEventListener('click', () => updateFamilyTree(person.name, allMembers));
    return element;
}
    async function updateFamilyTree(newCenterName, allMembers) {
        try {
            const response = await fetch(`${API_BASE_URL}/update_family_tree`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ new_center_name: newCenterName, all_members: allMembers }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            renderFamilyTree(data.family_members, data.insurance_proposal);
        } catch (error) {
            console.error('Error updating family tree:', error);
            document.getElementById('familyTree').innerHTML = '<p>家系図の更新中にエラーが発生しました。</p>';
        }
    }

    window.initFamilyTree = function(members) {
        const familyTreeElement = document.getElementById('familyTree');

        if (members && members.length > 0) {
            generateFamilyTree(members);
        } else {
            familyTreeElement.innerHTML = '<p>家族構成データがありません。</p>';
        }
    };
})();