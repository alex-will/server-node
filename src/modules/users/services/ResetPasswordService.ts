import { injectable, inject } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/Users';
// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';
import { addHours, isAfter } from 'date-fns';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const usertoken = await this.userTokensRepository.findByToken(token);

    if (!usertoken) {
      throw new AppError('user token does not exist');
    }

    const user = await this.usersRepository.findById(usertoken.user_id);

    if (!user) {
      throw new AppError('user does not exist');
    }

    const tokenCreateAt = usertoken.created_at;

    const compareDate = addHours(tokenCreateAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
