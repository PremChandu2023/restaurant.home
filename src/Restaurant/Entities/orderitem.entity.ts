import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './orders.entity';
import { MenuItems } from './menuitem.entity';
import { Exclude } from 'class-transformer';
import { Dateschema } from './date.entity';
import { Rating } from './ratings.entity';

@Entity('orderitem')
export class OrderItem {
  @PrimaryGeneratedColumn()
  orderItem_id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Order, (orders) => orders.orderItems)
  orders: Order;

  @ManyToOne(() => MenuItems, (menuitems) => menuitems.OrderItems)
  menuitems: MenuItems;
  
  @OneToOne(() => Rating, (rating) => rating.orderItem)
  rating: Rating;

  @Exclude()
  @Column(() => Dateschema)
  date: Dateschema;
}
