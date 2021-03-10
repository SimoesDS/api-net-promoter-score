import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

class SendMailService {
    private client: Transporter

    constructor() {
        nodemailer.createTestAccount().then( testAccount => {
            const { host, port, secure } = testAccount.smtp;
            const { user, pass } = testAccount;

            let transporter = nodemailer.createTransport({
                host,
                port,
                secure, // true for 465, false for other ports
                auth: {
                  user, // generated ethereal user
                  pass, // generated ethereal password
                },
              });

            this.client = transporter;
        });
    }

    async execute(to: string, subject: string, contextTemplate: object, pathTemplate: string) {
        const templateFileContent = fs.readFileSync(pathTemplate).toString('utf-8');

        const mailTemplateParse = handlebars.compile(templateFileContent);
        
        const html = mailTemplateParse(contextTemplate);

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreply@nps.com>",
        })

        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();
