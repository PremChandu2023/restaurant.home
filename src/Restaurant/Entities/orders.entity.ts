// import { Dateschema } from "src/polls/database-type-orm/Entities/date.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./orderitem.entity";
import { PaymentStatus } from "src/Restaurant/Enums/payment.enum";
import { OrderStatus } from "src/Restaurant/Enums/order.enum";
import { Exclude } from 'class-transformer';
import { Dateschema } from "./date.entity";
import { Restaurant } from "../restaurant/Entities/restaurant.entity";
import { Employee } from "./employee.entity";
import { User } from "./user.entity";
import { Rating } from "./ratings.entity";

@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn()
    order_id:number;

    @Column()
    customerName:string;

    @Column({default:null})
    tableNumber:number;

    @OneToMany(()=> OrderItem, (orderitems)=> orderitems.orders)
    orderItems:OrderItem[];

    @ManyToOne(() => Restaurant, (restaurants) => restaurants.orders)
    restaurant:Restaurant

    @ManyToOne(() => User, (orders) => orders.order)
    user:User

    @OneToMany(()=> Rating, (rating)=> rating.orders)
    rating:Rating[]
    @Column({type :'enum', enum : OrderStatus})
    orderStatus: OrderStatus

    @Column({type : 'enum', enum : PaymentStatus , default: 'pending'})
    paymentStatus:PaymentStatus

    @Exclude()
    @Column(() => Dateschema)
    date: Dateschema

}