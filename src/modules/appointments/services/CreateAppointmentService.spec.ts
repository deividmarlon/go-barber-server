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
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020,4,10,13),
    })

    expect(appointment).toHaveProperty('provider_id');
    expect(appointment.provider_id).toBe('provider-id');

  });

  it('should not be able to create two appointments on the same time', async ()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime();
    });

    const appointmentDate = new Date(2020,4,10,13);

    await createAppointment.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: appointmentDate,
    })

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: appointmentDate,
      })
    ).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment on a past date', async ()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime();
    });
    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date:new Date(2020,4,10,11),
      })
    ).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment where user and provider are equal', async ()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime();
    });
    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'provider-id',
        date:new Date(2020,4,10,13),
      })
    ).rejects.toBeInstanceOf(AppError);

  });

  it('should not be able to create an appointment before 8am and after 5pm', async ()=>{
    jest.spyOn(Date, 'now').mockImplementationOnce(()=>{
      return new Date(2020,4,10,12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date:new Date(2020,4,11,7),
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date:new Date(2020,4,11,18),
      })
    ).rejects.toBeInstanceOf(AppError);

  });

})
