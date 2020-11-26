import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

// Um CONTROLLER deve ter no máximo 5 métodos:
  // index, show, create, update, delete

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.params.id;
    const {day,month,year} = request.query;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService
    );

    const dayAvailability = await listProviderDayAvailability.execute({
      provider_id,
      day:Number(day),
      month:Number(month),
      year:Number(year),
    });

    return response.json(dayAvailability);
  }
}
