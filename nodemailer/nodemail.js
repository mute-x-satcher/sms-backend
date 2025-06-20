require('dotenv').config()
const nodemailer = require('nodemailer')
const path = require('path');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: 'mutex7171@gmail.com',
        pass: process.env.GOOGLE_APP_PASSWORD
    },
})

const sendEmail = async (email,code,organization) => {

try {
    const info = await transporter.sendMail({
      from: "Example Team", // sender address
      to: email, // list of receivers
      subject: "Hello", // Subject line
      html: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Pocket Catlog Verification Email </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <table
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="max-width: 600px; margin: auto; background-color: #ffffff; font-family: Arial, sans-serif;"
    >
      <tr>
        <td style="padding: 20px; text-align: center;">
          <h2 style="color: #333;">Classmark - ${organization} Verification</h2>
          <p style="font-size: 16px; font-weight: bold; color: #555;">
            Thank you for using Classmark for your ${organization}. 
            Please use the below verification code to verify yourself.
            Thanks!
          </p>
          <h1
            style="
              font-size: 40px;
              color: #ffffff;
              background-color: #007bff;
              padding: 15px 25px;
              border-radius: 8px;
              display: inline-block;
              letter-spacing: 5px;
              margin-top: 30px;
            "
          >
            ${code}
          </h1>
        </td>
      </tr>
    </table>
  </body>
</html>
`, // html body
    
    
    });

    console.log(code)

  } catch (err) {
    console.error("Error while sending mail", err);
  }

}

const sendQREmail = async (email,qrBuffer) => { 
  await transporter.sendMail({
      from: 'your_email@gmail.com',
      to: email,
      subject: 'WhatsApp QR Code',
      text: 'Scan the attached QR code to log in to WhatsApp.',
      attachments: [{
        filename: 'qr.png',
        content: qrBuffer,             // Send the buffer
        contentType: 'image/png'
      }]
    });
}


module.exports = {sendEmail,sendQREmail}