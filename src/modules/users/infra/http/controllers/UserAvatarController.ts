import { Request, Response } from 'express';
import { container } from 'tsyringe';
import {classToClass} from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  // Um CONTROLLER deve ter no máximo 5 métodos:
  // index, show, create, update, delete
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const updatedUser = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatar_filename: request.file.filename,
    });
    return response.json(classToClass(updatedUser));
  }
}
