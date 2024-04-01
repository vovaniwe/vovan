document.addEventListener('DOMContentLoaded', function() {
    fetch('/get-links')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('links-table').querySelector('tbody');
            data.forEach(item => {
                const row = tableBody.insertRow();

                const idCell = row.insertCell();
                idCell.textContent = item.ID;

                const linkCell = row.insertCell();
                linkCell.textContent = item.Ссылка;

                const actionCell = row.insertCell();
                const button = document.createElement('button');
                button.textContent = 'Перейти';
                button.onclick = () => window.location.href = item.Ссылка;
                actionCell.appendChild(button);
            });
        })
        .catch(error => console.error('Ошибка при получении данных:', error));
});
