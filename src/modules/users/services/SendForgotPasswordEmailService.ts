import { injectable, inject } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {

    const user = await this.usersRepository.findByEmail(email);

    if(!user){
      throw new AppError('User does not exists')
    }

    const {token} = await this.userTokensRepository.generate(user.id);

    const forgotPasswordEmailTemplateFile = path.resolve(
      __dirname, //diretório atual
      '..', //voltar uma
      'views',// entrar em views
      'forgot_password.hbs' // nome do arquivo desejado
    );

    await this.mailProvider.sendMail({
      to: {
        name:user.name,
        email:user.email,
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        templateFile: forgotPasswordEmailTemplateFile,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token}`,
        }
      }
    });
  }
}

export default SendForgotPasswordEmailService;
