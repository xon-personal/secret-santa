import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Wish } from '../wishes/wish.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true })
  recipientId: number;

  @OneToMany(() => Wish, (wish) => wish.user)
  wishes: Wish[];

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  recipient: User;
}
