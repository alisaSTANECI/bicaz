const express = require('express');
const fs = require('fs');
const cors = require('cors');
const nodemailer = require('nodemailer'); // 🔔 Adăugat

const app = express();
const PORT = process.env.PORT || 3000; // 🔧 Ajustat pentru Render

// ✅ Rută principală pentru verificare
app.get('/', (req, res) => {
  res.send('🎉 Serverul Căsuței Lac este online și funcționează perfect! 🛶');
});

// Middleware
app.use(cors());
app.use(express.json());

// ✉️ Configurare Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rezervari.bicaz@gmail.com',
    pass: 'qeei usym vxyp jqvb' // App Password generat
  }
});

// 🧭 Funcția care trimite emailul
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

  const rezervare = {
    perioada,
    nume,
    email,
    dataTrimiterii: new Date().toISOString()
  };

  fs.readFile('rezervari.json', 'utf8', (err, data) => {
    const rezervariExistente = !err ? JSON.parse(data) : [];
    rezervariExistente.push(rezervare);

    fs.writeFile('rezervari.json', JSON.stringify(rezervariExistente, null, 2), () => {
      res.json({ message: "✅ Rezervarea a fost salvată cu succes!" });

      // ✉️ Trimite email de confirmare
      trimiteEmailConfirmare(nume, email, perioada);
    });
  });
});

// Pornim serverul
app.listen(PORT, () => {
  console.log(`🛎️ Serverul rulează pe http://localhost:${PORT}`);
});
