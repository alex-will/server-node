import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;

let listProviders: ListProvidersService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listProviders = new ListProvidersService(fakeUsersRepository);
  });
  it('shold be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'jhon@gmail.com',
      name: 'jhon doe',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'jhont@gmail.com',
      name: 'jhon tre',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      email: 'jhonq@gmail.com',
      name: 'jhon qua',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
