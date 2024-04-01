document.addEventListener('DOMContentLoaded', () => {
    // Обработчик события клика на кнопку "Выбрать файл"
    document.getElementById('select-files-button').addEventListener('click', function () {
        // Имитируем клик по скрытому input[type="file"]
        document.getElementById('files').click();
    });

    // Обработчик события изменения содержимого input[type="file"]
    document.getElementById('files').addEventListener('change', function (event) {
        // Вызываем функцию handleFiles при изменении содержимого input[type="file"]
        handleFiles(event.target.files);
        // Показываем кнопку "Upload" после выбора файлов
        document.getElementById('upload-button').style.display = 'block';
    });

    // Функция для обработки выбранных файлов
    function handleFiles(inputFiles) {
        const filesArray = Array.from(inputFiles);

        const fileList = document.getElementById('file-list');
        fileList.innerHTML = ''; // Очищаем список перед добавлением новых файлов
        filesArray.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            fileList.appendChild(listItem);

            // Отправляем каждый файл на сервер
            uploadFile(file);
        });

        // Показываем список выбранных файлов
        fileList.style.display = 'block';
    }

    // Функция для отправки файла на сервер
    function uploadFile(file) {
        const formData = new FormData(); // Создаем новый объект FormData
        formData.append('file', file); // Добавляем выбранный файл в объект FormData

        // Отправляем данные на сервер
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки файла на сервер');
            }
        })
        .catch(error => {
            console.error('Ошибка загрузки файла:', error);
            alert('Произошла ошибка при загрузке файла на сервер.');
        });
    }

    // Отправка данных формы на сервер при нажатии кнопки "Upload"
    document.getElementById('upload-button').addEventListener('click', function (event) {
        event.preventDefault();
        // Очищаем список выбранных файлов и скрываем кнопку "Upload"
        document.getElementById('file-list').innerHTML = '';
        document.getElementById('file-list').style.display = 'none';
        document.getElementById('upload-button').style.display = 'none';
        alert('Файлы успешно загружены на сервер.');
    });
});
function uploadLink() {
    const link = document.getElementById('link-input').value;

    fetch('/upload-link', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ link })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
