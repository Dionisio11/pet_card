const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { currentYear: new Date().getFullYear() });
});

app.post('/api/booking', (req, res) => {
  const { name, phone, service, pet, note } = req.body;

  if (!name || !phone || !service || !pet) {
    return res.status(400).json({ success: false, message: '请填写必填项' });
  }

  const booking = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name, phone, service, pet, note: note || '',
    createdAt: new Date().toISOString()
  };

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const filePath = path.join(dataDir, 'bookings.json');
  let bookings = [];
  if (fs.existsSync(filePath)) {
    try {
      bookings = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch { bookings = []; }
  }
  bookings.push(booking);
  fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));

  console.log(`[新预约] ${booking.id} | ${name} | ${service} | ${pet}`);
  res.json({ success: true, message: '预约已提交，我们会尽快联系您！' });
});

app.use((req, res) => {
  res.status(404).render('index', { currentYear: new Date().getFullYear() });
});

app.listen(PORT, () => {
  console.log(`🐾 萌爪洗护 服务已启动`);
  console.log(`   本地访问: http://localhost:${PORT}`);
});
