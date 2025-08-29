import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

//   @OneToMany(() => CalendarEvent, (event) => event.user)
//   calendarEvents: CalendarEvent[];
}