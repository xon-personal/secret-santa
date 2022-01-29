import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  wishes: string;

  @Column({ nullable: true })
  recipientId: number;

  @OneToOne(() => User, { nullable: true })
  @JoinColumn()
  recipient: User;
}
