import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

  // Um CONTROLLER deve ter no máximo 5 métodos:
  // index, show, create, update, delete
export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { token,password } = request.body;

    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      token,
      password
    });

    return response.status(204).json();
  }
}
