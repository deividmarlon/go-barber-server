import { getHours, isAfter } from 'date-fns';

import { injectable, inject } from 'tsyringe';

//import User from '@modules/users/infra/typeorm/entities/User';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';


import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequestDTO {
  provider_id: string;
  day: number,
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {

  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year
  }: IRequestDTO): Promise<Appointment[]> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      day,
      month,
      year
    });

    return appointments;
  }
}

export default ListProviderAppointmentsService;