import { getDaysInMonth, getDate } from 'date-fns';

import { injectable, inject } from 'tsyringe';

//import User from '@modules/users/infra/typeorm/entities/User';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
}

type IResponseDTO = Array<{ //interface de arrays
  day:number;
  available:boolean
}>

@injectable()
class ListProviderMonthAvailabilityService {
  /** Princípio: Dependency Inversion
   * Sempre que o Service tiver uma dependência externa,
   * iremos receber tal dependência como um parâmetro da Classe no constructor
   */
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({provider_id,month,year}: IRequestDTO): Promise<IResponseDTO> {

    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      month,
      year
    });

    // criando array com length numberOfDaysInMonth
    // sendo a primeira posição o dia 1
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month-1));

    const eachDayArray = Array.from(
      {length: numberOfDaysInMonth},
      (value,index)=> index+1,
    );

    const availability = eachDayArray.map(day=>{

      const appointmentsInDay = appointments.filter(appointment =>{
        return getDate(appointment.date) === day;
      })

      return {
        day,
        available: appointmentsInDay.length < 10,
      };

    });

    return availability;

  }
}

export default ListProviderMonthAvailabilityService;
