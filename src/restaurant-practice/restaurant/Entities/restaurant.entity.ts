import { Exclude } from "class-transformer";
import { Dateschema } from "src/restaurant-practice/Entities/date.entity";
import { Menu } from "src/restaurant-practice/Entities/menu.entity";
import { MenuItems } from "src/restaurant-practice/Entities/menuitem.entity";
import { Order } from "src/restaurant-practice/Entities/orders.entity";
import { Column, Entity,OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('restaurant')
export class Restaurant {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    location:string

    @OneToMany(() => Menu,(menu)=> menu.restaurants)
    menus:Menu[]

    @OneToMany(() => MenuItems, (menuitems) => menuitems.restaurant)
    menu_Items : MenuItems[]

    @OneToMany(() => Order,(orders)=> orders.restaurant)
    orders:Order[]

    @Exclude()
    @Column(() => Dateschema)
    date: Dateschema

}