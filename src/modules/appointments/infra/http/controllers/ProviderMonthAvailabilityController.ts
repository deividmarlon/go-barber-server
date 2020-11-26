import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

// Um CONTROLLER deve ter no máximo 5 métodos:
  // index, show, create, update, delete

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.params.id;
    const {month,year} = request.query;

    const listProviderMonthAvailability = container.resolve(
      ListProviderMonthAvailabilityService
    );

    const monthAvailability = await listProviderMonthAvailability.execute({
      provider_id,
      month:Number(month),
      year:Number(year),
    });

    return response.json(monthAvailability);
  }
}
