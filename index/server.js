// Подключаем необходимые модули
const express = require('express'); // Фреймворк Express.js для создания веб-приложений
const multer = require('multer'); // Модуль multer для обработки многочисленных файлов, загружаемых через HTTP POST
const path = require('path'); // Встроенный модуль Node.js для работы с путями к файлам и директориям
const fs = require('fs'); // Встроенный модуль Node.js для работы с файловой системой
const sql = require('mssql');

// Создаем экземпляр приложения Express
const app = express();
const port = 8080; // Порт, на котором будет работать сервер
app.use(express.json());
// Добавьте middleware для обработки CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const sqlConfig = {
    user:'VEYVAN',
    database: 'gena',
    password:'123456',
    server: 'Veyvan',
    options: {
        encrypt: true,
        trustServerCertificate: true // для разработки, в продакшне лучше использовать настоящие сертификаты
    }
};
// Создание экземпляра pool
const pool = new sql.ConnectionPool(sqlConfig);
const poolConnect = pool.connect();

poolConnect
  .then(() => {
    console.log("Подключение к базе данных успешно");
  })
  .catch((err) => {
    console.error("Ошибка подключения к базе данных:", err);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

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
app.post('/upload-link', async (req, res) => {
  try {
    let link = req.body.link; // Получаем значение ссылки из тела запроса
    console.log(link); // Проверка полученных данных
    await pool.connect();
    const result = await pool.request()
      .input('link', sql.NVarChar, link) // Указываем параметр для запроса
      .query('INSERT INTO dbo.Ссылки (Ссылка) VALUES (@link)');
    console.log(result); // Проверка результата запроса
    res.json({ success: true, message: 'Ссылка успешно добавлена' });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Ошибка при добавлении ссылки' });
  }
});


