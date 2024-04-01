document.addEventListener('DOMContentLoaded', function() {
    fetch('/files-list')
        .then(response => response.json())
        .then(files => {
            const tableBody = document.getElementById('files-table').querySelector('tbody');
            files.forEach(file => {
                const row = tableBody.insertRow();

                const nameCell = row.insertCell();
                nameCell.textContent = file;

                const actionCell = row.insertCell();
                const downloadButton = document.createElement('button');
                downloadButton.textContent = 'Скачать';
                // Предположим, что у вас есть маршрут для скачивания файла
                downloadButton.onclick = () => window.location.href = `/download?file=${file}`;
                actionCell.appendChild(downloadButton);
            });
        })
        .catch(error => console.error('Ошибка при получении списка файлов:', error));
});
