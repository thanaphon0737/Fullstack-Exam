import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';

@Entity()
export class User {


  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({ unique: true }) 
  email: string;

  @Column()
  password: string;

  @Column({ default: 'staff' }) 
  role: string;


  @CreateDateColumn()
  createdAt: Date;


  @UpdateDateColumn()
  updatedAt: Date;
}