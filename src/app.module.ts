import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { WishesModule } from './wishes/wishes.module';
import { Wish } from './wishes/wish.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'santa.sqlite',
      entities: [User, Wish],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
