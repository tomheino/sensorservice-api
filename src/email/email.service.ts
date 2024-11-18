import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
// import env from 'src/.env'

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Määritetään SMTP-yhteys Gmailille
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Käytetään Gmail-palvelua
      host: 'smtp.gmail.com', // Gmailin SMTP-palvelin
      port: 465, // Käytetään porttia 465 (SSL)
      secure: true, // Varmentaa, että yhteys on suojattu
      auth: {
        user: process.env.SMTP_USER, // Gmail-osoitteesi
        pass: process.env.SMTP_PASS, // Sovelluskohtainen salasana 
      },
    });

  }

  // Funktio sähköpostin lähettämiseen
  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.SMTP_USER, // Lähettäjän osoite
      to, // Vastaanottajan osoite
      subject, // Sähköpostin otsikko
      text, // Sähköpostin sisältö
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Sähköposti lähetetty: ' + info.response);
    } catch (error) {
      console.error('Virhe sähköpostia lähetettäessä: ', error);
    }
  }
}



