import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService'
import { JsonWebTokenError } from 'jsonwebtoken';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;


describe('ListProviderDayAvailability', ()=>{
  beforeEach(()=>{
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailability = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository
    );
  })

  it('should be able to list the day avaiability from provider', async ()=>{
    await fakeAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020,4,20,14,0,0),
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user_id',
      date: new Date(2020,4,20,15,0,0),
    })

    jest.spyOn(Date,'now').mockImplementationOnce(()=>{
      return new Date(2020,4,20,11,0,0).getTime();
    })

    const avaiability = await listProviderDayAvailability.execute({
      provider_id: 'user_id',
      day: 20,
      month: 5,
      year: 2020,
    })

    //espero que seja um array com os horários 8 e 10 falsos

    expect(avaiability).toEqual(
      expect.arrayContaining(
        [
          { hour: 8, available: false},
          { hour: 9, available: false},
          { hour: 10, available: false},
          { hour: 11, available: false},
          { hour: 12, available: true},
          { hour: 13, available: true},
          { hour: 14, available: false},
          { hour: 15, available: false},
          { hour: 16, available: true},
        ]
    ))

  });


})
