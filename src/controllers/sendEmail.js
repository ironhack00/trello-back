const nodemailer = require('nodemailer');

function enviarCorreo(invitees) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'guille.fernandeeez@gmail.com',
      pass: 'hfnl rpps ycsv nsdz',
    },
  });

  invitees.forEach(( email ) => {
    console.log(email)
    const mailOptions = {
      from: 'Trello <guille.fernandeeez@gmail.com>',
      to: email,
      subject: 'Invitación a Trello',
      html: `<!DOCTYPE html>
        <html lang="es">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>  
             
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

    <div style="background-color: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #007bff; text-align: center;">¡Hola!</h2>
        <p style="text-align: center; font-size: 16px;">Has sido invitado a un nuevo board en Trello.</p>
        <p style="text-align: center; font-size: 16px;">Puedes acceder al board haciendo clic en el siguiente botón:</p>
        <p style="text-align: center;">
            <a href="https://trello-3.vercel.app/" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Acceder al board</a>
        </p>
        <p style="text-align: center; font-size: 16px;">¡Esperamos verte allí!</p>
    </div>

</body>
        
        </html>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error al enviar el correo electrónico a ${email}:`, error);
      } else {
        console.log(`Correo electrónico enviado a ${email}:`, info.response);
      }
    });
  });
}

module.exports = enviarCorreo;
