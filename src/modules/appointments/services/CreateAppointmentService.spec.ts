import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', ()=>{
  beforeEach(()=>{
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
  })

  it('should be able to create a new appointment', async ()=>{
    const appointment = await createAppointment.execute({
      provider_id: '123123',
      date: new Date(),
    })

    expect(appointment).toHaveProperty('provider_id');
    expect(appointment.provider_id).toBe('123123');

  });

  it('should not be able to create a new appointment', async ()=>{
    const appointmentDate = new Date(2020,5,4,23);

    await createAppointment.execute({
      provider_id: '123123',
      date: appointmentDate,
    })

    await expect(
      createAppointment.execute({
        provider_id: '123123',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);

  });
})
