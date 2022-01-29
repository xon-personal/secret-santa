import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const count = await this.findAll().then((users) => {
      return users.length;
    });
    if (count >= 500) {
      throw new HttpException(
        { message: 'More than 500 users not allowed' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const user = new User();
    user.name = createUserDto.name;
    user.surname = createUserDto.surname;
    user.wishes = createUserDto.wishes;
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<object> {
    const user = await this.usersRepository.findOne(id);
    if (!user.recipientId) {
      throw new HttpException(
        { message: 'Firstly shuffle users to get your recipient' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const recipient = await this.usersRepository.findOne(user.recipientId);
    return {
      name: recipient.name,
      surname: recipient.surname,
      wishes: recipient.wishes,
    };
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async shuffle(): Promise<number> {
    const users = await this.findAll();
    const count = users.length;
    if (count < 3) {
      throw new HttpException(
        { message: `Please add more users, current: ${count}` },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (users[0].recipientId) {
      throw new HttpException(
        { message: 'Users has been already shuffled' },
        HttpStatus.BAD_REQUEST,
      );
    }
    UsersService.shuffleUserArray(users);
    for (let i = 0; i < users.length - 1; i++) {
      await this.usersRepository.update(users[i].id, {
        recipient: users[i + 1],
      });
    }
    await this.usersRepository.update(users[users.length - 1].id, {
      recipient: users[0],
    });
    return 1;
  }

  private static shuffleUserArray(users: User[]): void {
    for (let i = users.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = users[i];
      users[i] = users[j];
      users[j] = temp;
    }
  }
}
