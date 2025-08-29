import { CalendarEventEntity } from "src/calendar/entities/calendar-event.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => CalendarEventEntity, (event) => event.user)
  calendarEvents: CalendarEventEntity[];
}