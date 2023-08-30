
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./orders.entity";
import { MenuItems } from "./menuitem.entity";
import { Exclude } from "class-transformer";
import { Dateschema } from "./date.entity";

@Entity('orderitem')
export class OrderItem {

    @PrimaryGeneratedColumn()
    orderItem_id:number;

    
    @Column()
    quantity:number;

    @ManyToOne(()=> Order, (orders) => orders.orderItems)
    orders:Order

    @ManyToOne(()=> MenuItems, (menuitems)=> menuitems.OrderItems,{eager:true})
    menuitems:MenuItems

    @Exclude()
    @Column(() => Dateschema)
    date: Dateschema

}