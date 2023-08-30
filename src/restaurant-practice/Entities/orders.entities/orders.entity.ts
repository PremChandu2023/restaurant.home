// import { Dateschema } from "src/polls/database-type-orm/Entities/date.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./orderitem.entity";
import { PaymentStatus } from "src/restaurant-practice/Menu/enums/payment.enum";
import { OrderStatus } from "src/restaurant-practice/Menu/enums/order.enum";
import { Exclude } from 'class-transformer';
import { Dateschema } from "./date.entity";

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

    @Column({type :'enum', enum : OrderStatus})
    orderStatus: OrderStatus

    @Column({type : 'enum', enum : PaymentStatus , default: 'pending'})
    paymentStatus:PaymentStatus

    @Exclude()
    @Column(() => Dateschema)
    date: Dateschema

}