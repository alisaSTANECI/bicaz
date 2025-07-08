const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configurat corect pentru orice origine și metodele necesare
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options('*', cors());

app.use(express.json());

// Rută principală pentru verificare
app.get('/', (req, res) => {
  res.send('🎉 Serverul Căsuțe Lac este online și funcționează perfect! 🛶');
});

// Configurare Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rezervari.bicaz@gmail.com',
    pass: 'qeei usym vxyp jqvb'
  }
});

// Funcția care trimite emailul
function trimiteEmailConfirmare(nume, email, perioada) {
  const mailOptions = {
    from: 'rezervari.bicaz@gmail.com',
    to: email,
    subject: 'Confirmare rezervare - Căsuța Lacului',
    text: `Salut, ${nume}!\n\nRezervarea ta pentru perioada ${perioada} a fost înregistrată cu succes.\n\nTe așteptăm cu drag la Lacul Bicaz! 🛶\n\nEchipa Căsuței Lacului`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Eroare la trimitere:', error);
    } else {
      console.log('📬 Email trimis:', info.response);
    }
  });
}

// RUTĂ pentru rezervări
app.post('/rezerva', (req, res) => {
  const { perioada, nume, email } = req.body;

  if (!perioada || !nume || !email) {
    return res.status(400).json({ message: "Date lipsă!" });
  }

  // Trimite răspuns imediat (nu scrie în fișier pe Render!)
  res.json({ message: "✅ Rezervarea a fost salvată cu succes!" });

  // Trimite email de confirmare (opțional, asincron)
  trimiteEmailConfirmare(nume, email, perioada);
});

// Pornim serverul
app.listen(PORT, () => {
  console.log(`🛎️ Serverul rulează pe portul ${PORT}`);
});