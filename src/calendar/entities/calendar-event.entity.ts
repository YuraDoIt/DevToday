import { UserEntity } from "src/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class CalendarEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string; 

  @Column()
  date: string; 

  @Column()
  countryCode: string;

  @ManyToOne(() => UserEntity, (user) => user.calendarEvents, { onDelete: 'CASCADE' })
  user: UserEntity;
}