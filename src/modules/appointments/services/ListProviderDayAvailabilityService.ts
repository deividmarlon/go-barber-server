import { getHours, isAfter } from 'date-fns';

import { injectable, inject } from 'tsyringe';

//import User from '@modules/users/infra/typeorm/entities/User';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequestDTO {
  provider_id: string;
  day: number,
  month: number;
  year: number;
}

type IResponseDTO = Array<{ //interface de arrays
  hour:number;
  available:boolean
}>

@injectable()
class ListProviderDayAvailabilityService {
  /** Princípio: Dependency Inversion
   * Sempre que o Service tiver uma dependência externa,
   * iremos receber tal dependência como um parâmetro da Classe no constructor
   */
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year
  }: IRequestDTO): Promise<IResponseDTO> {

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      day,
      month,
      year
    });

    // criando array com length numberOfAppointmentsInOneDay
    const numberOfAppointmentsInOneDay = 10;
    const hourStart = 8;

    const eachHoutArray = Array.from(
      {length: numberOfAppointmentsInOneDay},
      (value,index)=> index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHoutArray.map(hour=>{

      const hasAppointmentInHour = appointments.find(appointment =>
        getHours(appointment.date) === hour
      )

      const compareDate = new Date(year,month-1,day,hour);
      console.log(`${year}/${month-1}/${day}/${hour}`);
      console.log(currentDate.toLocaleDateString());
      console.log(compareDate.toLocaleDateString());
      console.log(isAfter(compareDate,currentDate));
      console.log(!hasAppointmentInHour);
      console.log('\n');

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate,currentDate),
      };

    });

    return availability;

  }
}

export default ListProviderDayAvailabilityService;
