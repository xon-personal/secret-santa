import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish])],
  exports: [WishesService],
  providers: [WishesService],
})
export class WishesModule {}
