import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private connection: Connection,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
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
    user.name = dto.name;
    user.surname = dto.surname;
    const wishes = [];
    for (const description of dto.wishes) {
      const wish = new Wish();
      wish.description = description;
      await this.wishesService.create(wish);
      wishes.push(wish);
    }
    user.wishes = wishes;
    return await this.usersRepository.save(user);
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
    const wishes = await this.wishesService
      .getByUser(user.recipientId)
      .then((wishes) => {
        return wishes.map((wish) => {
          return wish.description;
        });
      });
    return {
      name: recipient.name,
      surname: recipient.surname,
      wishes: wishes,
    };
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async shuffle(): Promise<void> {
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
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    UsersService.shuffleUserArray(users);
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < users.length - 1; i++) {
        await queryRunner.manager.update(User, users[i].id, {
          recipient: users[i + 1],
        });
      }
      await queryRunner.manager.update(User, users[users.length - 1].id, {
        recipient: users[0],
      });
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        { message: 'Error on shuffling users' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
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
