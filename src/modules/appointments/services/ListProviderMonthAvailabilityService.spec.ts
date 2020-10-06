import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService'

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;


describe('ListProviderMonthAvailability', ()=>{
  beforeEach(()=>{
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository
    );
  })

  it('should be able to list the month avaiability from provider', async ()=>{
    let i;

    for(i = 8; i<18; i++){
      await fakeAppointmentsRepository.create({
        provider_id: 'provider_id',
        user_id:'user_id',
        date: new Date(2020,4,20,i,0,0),
      })
    }

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id:'user_id',
      date: new Date(2020,4,21,8,0,0),
    })

    const avaiability = await listProviderMonthAvailability.execute({
      provider_id: 'provider_id',
      month: 5,
      year: 2020,
    })

    //espero que seja um array com os dias 20 e 21 avaiable false

    expect(avaiability).toEqual(
      expect.arrayContaining(
        [
          { day: 19, available: true},
          { day: 20, available: false},
          { day: 21, available: true},
          { day: 22, available: true},
        ]
    ))

  });
})
