// Обработчик события клика на кнопку "Выбрать файл"
document.getElementById('select-files-button').addEventListener('click', function () {
    // Имитируем клик по скрытому input[type="file"]
    document.getElementById('files').click();
});

document.getElementById('files').addEventListener('change', function (event) {
    const file = event.target.files[0]; // Получаем первый выбранный файл
    if (file) {
        document.getElementById('filename').textContent = `Selected file: ${file.name}`;
        document.getElementById('upload-button').style.display = 'block'; // Показываем кнопку "Upload"
    }
});

// Отправка формы на сервер
document.getElementById('upload-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы
    const formData = new FormData(this); // Создаем новый объект FormData с данными формы

    // Отправляем данные на сервер
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка загрузки файла на сервер');
        }
        return response.json();
    })
    .then(data => {
        alert('Файл успешно загружен на сервер.');
    })
    .catch(error => {
        console.error('Ошибка загрузки файла:', error);
        alert('Произошла ошибка при загрузке файла на сервер.');
    });
});


