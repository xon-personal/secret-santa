import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wish } from './wish.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(wish: Wish) {
    return await this.wishesRepository.save(wish);
  }

  async getByUser(id: number) {
    return await this.wishesRepository.find({ where: { userId: id } });
  }
}
