interface MailContact {
  name: string;
  email: string;
}

interface TemplateProps {
  file: string;
  link: string;
}

export interface SendMailInput {
  to: MailContact;
  from?: MailContact;
  subject: string;
  template: TemplateProps;
}

export interface Mailer {
  sendMail(mail: SendMailInput): Promise<void>;
}
