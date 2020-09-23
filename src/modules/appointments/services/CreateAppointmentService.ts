import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// Services são criados para respeitar o conceito de DRY - Don't Repeat Yourself

// O Service nunca tem acesso às variáveis de Request e Response da requisição em si

/** Ações necessárias em um Service:
 * [x] Recebimento de informações
 * [x] Tratativas de erros/excessões
 * [x] Acesso ao Repositório
 */

interface IRequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  /** Princípio: Dependency Inversion
   * Sempre que o Service tiver uma dependência externa,
   * iremos receber tal dependência como um parâmetro da Classe no constructor
   */
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({
    provider_id,
    date,
  }: IRequestDTO): Promise<Appointment> {
    // [x] Recebimento de informações

    const appointmentDate = startOfHour(date); //
    // startOfHour faz um set para o início da hora no objeto Date(), ou seja,
    // seta os minutos, segundos e milisegundos para 0.
    // A hora irá retornar 3 horas a mais por causa do time-zone do server.

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Appointment time already booked!'); // [x] Tratativas de erros/excessões
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // O método appointmentsRepository.create cria somente uma instância do appointment.
    // Para salvar a instância no banco de dados, faze-se necessário:
    // appointmentsRepository.save !!!

    return appointment;
  }
}

export default CreateAppointmentService;
