document.getElementById('file-label').addEventListener('click', function () {
    document.getElementById('file').click();
});

document.getElementById('file').addEventListener('change', handleFiles);

document.addEventListener('paste', async (event) => {
    try {
        const clipboardItems = event.clipboardData.items;
        for (const clipboardItem of clipboardItems) {
            if (clipboardItem.kind === 'file') {
                const blob = clipboardItem.getAsFile();
                handleFiles(blob);
            }
        }
    } catch (e) {
        console.error('Ошибка вставки файла из буфера обмена', e);
    }
});


let dropArea = document.getElementById('drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => highlight(dropArea), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => unhighlight(dropArea), false);
});

function highlight(elem) {
    elem.classList.add('highlight');
}

function unhighlight(elem) {
    elem.classList.remove('highlight');
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files[0]);
}

function handleFiles(inputFiles) {
    // Определяем файл для обработки
    // Если функция вызывается с FileList (например, из input[type="file"]), берем первый файл
    const file = inputFiles instanceof FileList ? inputFiles[0] : inputFiles;

    // Показываем имя файла в интерфейсе
    document.getElementById('filename').textContent = file.name;

    // Показываем кнопку "Upload"
    document.getElementById('submit-button').style.display = 'block';

    // Здесь можно добавить дополнительную логику обработки файла
    // Например, создание FormData и отправка файла на сервер через AJAX
}


