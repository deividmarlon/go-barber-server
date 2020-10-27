// Services são criados para respeitar o conceito de DRY - Don't Repeat Yourself
// O Service nunca tem acesso às variáveis de Request e Response da requisição em si


import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequestDTO {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  /** Princípio: Dependency Inversion
   * Sempre que o Service tiver uma dependência externa,
   * iremos receber tal dependência como um parâmetro da Classe no constructor
   */
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequestDTO): Promise<Appointment> {

    const appointmentDate = startOfHour(date); //
    // startOfHour faz um set para o início da hora no objeto Date(), ou seja,
    // seta os minutos, segundos e milisegundos para 0.
    // A hora irá retornar 3 horas a mais por causa do time-zone do server.

    if (isBefore(appointmentDate, Date.now())){
      throw new AppError('You can not creat an appointment on a past date!'); // [x] Tratativas de erros/excessões
    }

    if (user_id===provider_id){
      throw new AppError('You can not creat an appointment with yourself!'); // [x] Tratativas de erros/excessões
    }

    if(getHours(appointmentDate) < 8 ||getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appointments between 8am and 5pm!'); // [x] Tratativas de erros/excessões
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Appointment time already booked!'); // [x] Tratativas de erros/excessões
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate,"dd/MM/yyyy 'às' HH:mm");

    await this.notificationsRepository.create({
      content:`Novo agendamento para o dia ${dateFormatted}`,
      recipient_id:provider_id
    });

     await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        "yyyy-M-d"
      )}`
    );


    return appointment;
  }
}

export default CreateAppointmentService;
