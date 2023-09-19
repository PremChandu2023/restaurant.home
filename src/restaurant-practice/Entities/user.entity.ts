
import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { Roles } from './roles.entity';
  import { publicEncrypt } from 'crypto';
  import * as bycrypt from 'bcrypt';
  import { Dateschema } from './date.entity';
  import { IsNumberString } from 'class-validator';
  import { Token } from './token.enitty';
  import { Order } from './orders.entity';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: false })
    @Index('name1_idx')
    user_Name: string;
  
  
    @Column({ nullable: false })
    email: string;
  
    @Column({ nullable: false,select: false })
    password: string;
  
    @Column({ nullable: true })
    @IsNumberString()
    phoneNumber: string;
  
    @OneToMany(() => Order, (users) => users.user)
    order:Order[]
  
  
    @Column(() => Dateschema)
    date: Dateschema;
  
    @BeforeInsert()
    hashPassword() {
      this.password = bycrypt.hashSync(this.password, 10);
    }
  }
  