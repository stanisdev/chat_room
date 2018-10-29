const nodemailer = require('nodemailer');
const nunjucks = require('nunjucks');
const config = require(process.env.CONFIG_PATH);
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

module.exports = {
  send(params) {
    return new Promise((resolve, reject) => {
      const { email, data, type } = params;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.MAILER.AUTH.USER,
          pass: config.MAILER.AUTH.PASSWORD,
        },
      });
      const emailParams = this.getEmailParams()[type];
      if (!(emailParams instanceof Object)) {
        reject(new Error('Wrong mailer param type'));
      }

      data.appName = config.APP_NAME;
      this.compileTemplate(emailParams.template, data)
        .then(html => {
          const mailOptions = this.prepareMailOptions({
            to: email,
            subject: emailParams.subject,
            html,
          });

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        })
        .catch(reject);
    });
  },

  async compileTemplate(templateName, templateParams) {
    const templatesPath = path.join(
      config.MAILER.TEMPLATES_PATH,
      templateName + '.html'
    );
    const fileContent = await readFile(templatesPath, 'utf8');

    const template = nunjucks.compile(fileContent);
    return template.render(templateParams);
  },

  prepareMailOptions(params) {
    const { html, to, subject } = params;
    return (mailOptions = {
      from: `"${config.APP_NAME}" <${config.MAILER.FROM}>`,
      to,
      subject,
      html,
    });
  },

  getEmailParams() {
    // @TODO: Keep such config in a separate config file "mailer.json"
    return {
      USER_REGISTRATION: {
        subject: 'Confirm your email',
        template: 'userRegistration',
      },
    };
  },
};
