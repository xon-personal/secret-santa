import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'iPhone 1300',
    description: 'Wish description.',
  })
  @Column()
  description: string;

  @ApiProperty({
    example: 1,
    description: 'ID of user',
  })
  @Column({ nullable: true, unique: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.wishes)
  user: User;
}
