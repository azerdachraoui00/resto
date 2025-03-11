const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

const sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:5173/Reset?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation du mot de passe",
    html: `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation du mot de passe</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              background-image: url('http://localhost:5173/bg.jpg');
              background-size: cover;
              background-position: center;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: rgba(255, 255, 255, 0.8);
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
              text-align: center;
            }
            h2 {
              color: #333;
              font-size: 24px;
            }
            p {
              font-size: 16px;
              color: #555;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              margin-top: 20px;
              background-color: #ff9f1a;
              color: #fff;
              text-decoration: none;
              font-weight: bold;
              border-radius: 5px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #aaa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Réinitialisez votre mot de passe</h2>
            <p>Bonjour,</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :</p>
            <a href="${resetLink}" class="button">Réinitialiser le mot de passe</a>
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
            <div class="footer">
              <p>© 2025 Votre Site - Tous droits réservés.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });
};



module.exports = { sendResetEmail };
