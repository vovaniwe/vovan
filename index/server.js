const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

// Указываем папку для загрузки файлов
const UPLOAD_FOLDER = 'D:/files'; // Путь к папке на вашем компьютере

// Создаем хранилище multer для сохранения загруженных файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Создаем экземпляр multer
const upload = multer({ storage: storage });

// Указываем папку со статическими файлами (если нужно)
app.use(express.static('.'));

// Проверка существования папки для загрузки, иначе создаем её
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER);
}

// Обработчик GET запроса на главную страницу
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file); // Для отладки
  res.json({ message: 'Файл успешно загружен' });
});


// Запускаем сервер
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
