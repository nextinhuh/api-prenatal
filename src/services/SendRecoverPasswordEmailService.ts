import nodemailer, { Transporter } from 'nodemailer';
import path from 'path';
import handlebars from 'handlebars';
import fs from 'fs';
import ISendMailDTO from '../models/dtos/ISendMailDTO';

interface ITemplateVariables {
  [key: string]: string | number;
}

interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}

export default class SendRecoverPasswordEmailService {
  public async sendMail({ to, subject, from }: ISendMailDTO): Promise<void> {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      'views',
      'forgot_password.hbs',
    );

    const templateData = {
      file: forgotPasswordTemplate,
      variables: {
        name: 'Álvaro Neto',
        link: `${process.env.APP_WEB_URL}/reset-password?token=${'123'}`,
      },
    };

    const message = await transporter.sendMail({
      from: {
        name: 'Equipe Cegonha APP',
        address: 'netinhojogos3@gmail.com',
      },
      to: {
        name: 'Álvaro Neto',
        address: 'alvaro_neto96@hotmail.com',
      },
      subject: '[Cegonha APP] Recuperação de senha',
      html: await this.convertHtml(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }

  public async convertHtml(data: IParseMailTemplateDTO) {
    const templateFileContent = await fs.promises.readFile(data.file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(data.variables);
  }
}
