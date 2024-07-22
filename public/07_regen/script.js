document.addEventListener('DOMContentLoaded', function() {
    let familyData = null;

    function renderFamilyTree(centerPerson) {
        const container = document.getElementById('familyTreeContainer');
        container.innerHTML = '';

        if (!familyData) return;

        const generations = [
            familyData.parents,
            [centerPerson, ...familyData.spouse],
            familyData.children
        ];

        generations.forEach((generation, index) => {
            const generationDiv = document.createElement('div');
            generationDiv.className = 'generation';

            generation.forEach(person => {
                const personDiv = document.createElement('div');
                personDiv.className = 'person';
                personDiv.textContent = `${person.name} (${person.description})`;
                personDiv.onclick = () => renderFamilyTree(person);
                generationDiv.appendChild(personDiv);
            });

            container.appendChild(generationDiv);
        });
    }

    window.addEventListener('message', function(event) {
        if (event.data.type === 'familyData') {
            familyData = event.data.family;
            renderFamilyTree(familyData.parents[0]); // 最初は親の1人を中心に表示
        }
    });

    // 親ウィンドウにデータを要求
    window.parent.postMessage({ type: 'requestFamilyData' }, '*');
});