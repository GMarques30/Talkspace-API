import {
  Mailer,
  SendMailInput,
} from 'src/domain/user/application/mailer/mailer';

export class FakeMailer implements Mailer {
  public mails: SendMailInput[] = [];

  async sendMail(mail: SendMailInput): Promise<void> {
    this.mails.push(mail);
  }
}
