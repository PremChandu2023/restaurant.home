// rating.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Restaurant } from '../restaurant/Entities/restaurant.entity';
import { Order } from './orders.entity';
import { OrderItem } from './orderitem.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 2, scale: 1}) // Example: Decimal type for rating with precision 5 and scale 2.
  value: number;

  @Column({ type: 'text' })
  review: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.rating,{cascade: ['remove']})
  @JoinColumn({ name: 'restaurantId' }) 
  restaurant: Restaurant;

  @ManyToOne(() => Order,(orders)=> orders.rating,{cascade: ['remove']})
  @JoinColumn({name:'orderId'})
  orders:Order

  @OneToOne(() => OrderItem, (orderItems) => orderItems.rating)
  @JoinColumn()
  orderItem:OrderItem
}
