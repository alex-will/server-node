import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appoitmentDate = startOfHour(date);

    if (isBefore(appoitmentDate, Date.now())) {
      throw new AppError("you can't create appointment on a past date");
    }

    if (user_id === provider_id) {
      throw new AppError("you can't create an appointment with yourself");
    }

    if (getHours(appoitmentDate) < 8 || getHours(appoitmentDate) > 17) {
      throw new AppError(
        'you can only create an appointment between 8pm and 5pm',
      );
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appoitmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is alredy booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appoitmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
