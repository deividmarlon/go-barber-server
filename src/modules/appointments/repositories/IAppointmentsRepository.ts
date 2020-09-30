import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProvicerDTO from '@modules/appointments/dtos/IFindAllInDayFromProvicerDTO';


export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO
  ):Promise<Appointment[]>;
  findAllInDayFromProvicer(
    data: IFindAllInDayFromProvicerDTO
  ):Promise<Appointment[]>

}
