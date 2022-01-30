import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Wish } from '../wishes/wish.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Ivan', description: 'The name of user' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Pupkin', description: 'The surname of user' })
  @Column()
  surname: string;

  @Column({ nullable: true })
  recipientId: number;

  @ApiProperty({
    example: [{ id: 1, description: 'wish1', userId: 1 }],
    description: 'Wishes list of user',
  })
  @OneToMany(() => Wish, (wish) => wish.user, { cascade: true })
  wishes: Wish[];

  @OneToOne(() => User, { nullable: true, cascade: true })
  @JoinColumn()
  recipient: User;
}
