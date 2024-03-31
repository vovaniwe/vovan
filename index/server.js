// Подключаем необходимые модули
const express = require('express'); // Фреймворк Express.js для создания веб-приложений
const multer = require('multer'); // Модуль multer для обработки многочисленных файлов, загружаемых через HTTP POST
const path = require('path'); // Встроенный модуль Node.js для работы с путями к файлам и директориям
const fs = require('fs'); // Встроенный модуль Node.js для работы с файловой системой

// Создаем экземпляр приложения Express
const app = express();
const port = 8080; // Порт, на котором будет работать сервер

// Пути к папкам для временных и постоянных загруженных файлов
const TEMP_UPLOAD_FOLDER = 'temp'; // Папка для временных загруженных файлов
const UPLOAD_FOLDER = 'D:\\files'; // Папка для сохранения загруженных файлов

// Настройка хранилища multer для временных загруженных файлов
const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER); // Сохраняем временные файлы сразу в папку назначения
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Настройка multer для временных загруженных файлов
const uploadTemp = multer({ 
  storage: tempStorage,
  preservePath: true // Сохраняем оригинальное имя файла
});

// Настройка хранилища multer для сохранения загруженных файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Настройка multer для сохранения загруженных файлов
const upload = multer({ 
  storage: storage,
  preservePath: true // Сохраняем оригинальное имя файла
});

// Указываем Express использовать статические файлы из текущей директории
app.use(express.static('.'));

// Создаем папку для загрузки файлов, если она не существует
if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER);
}

// Создаем папку для временных загруженных файлов, если она не существует
if (!fs.existsSync(TEMP_UPLOAD_FOLDER)) {
  fs.mkdirSync(TEMP_UPLOAD_FOLDER);
}

// Обработчик GET запроса на главную страницу
app.get('/', (req, res) => {
  res.charset = 'utf-8'; // Устанавливаем кодировку для ответа
  res.setHeader('Content-Type', 'text/html'); // Устанавливаем заголовок Content-Type
  res.sendFile(path.join(__dirname, 'index.html')); // Отправляем файл index.html клиенту
});

// Обработчик GET запроса для получения списка файлов
app.get('/files', (req, res) => {
  // Получаем список файлов в папке загрузки
  fs.readdir(UPLOAD_FOLDER, (err, files) => {
    if (err) {
      console.error('Ошибка при чтении директории:', err);
      res.status(500).json({ error: 'Ошибка при чтении директории' });
      return;
    }
    res.json({ files: files }); // Отправляем список файлов клиенту в формате JSON
  });
});

// Обработчик POST запроса для загрузки временного файла
app.post('/upload', uploadTemp.single('file'), (req, res) => {
  // Файлы уже сохранены в папке назначения
  res.json({ message: 'Файл успешно загружен' });
});

// Запускаем сервер на указанном порту
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
