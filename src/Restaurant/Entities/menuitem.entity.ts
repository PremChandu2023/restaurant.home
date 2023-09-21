import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Menu } from "./menu.entity";
import { OrderItem } from "./orderitem.entity";
import { Exclude } from "class-transformer";
import { Dateschema } from "./date.entity";
import { Restaurant } from "../restaurant/Entities/restaurant.entity";
import { MenuItemStatus } from "../Menu/Enums/menuItem.status";

@Entity('menuitems')
export class MenuItems {

    @PrimaryGeneratedColumn()
    menuitem_id:number;

    @Column({nullable:true})
    menu_itemname:string;

    @Column({nullable:true})
    price:number

    @ManyToOne(()=> Menu, (menus)=> menus.menuItems)
    menus:Menu

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.menu_Items)
    restaurant:Restaurant


    @OneToMany(()=> OrderItem, (orderitems)=> orderitems.menuitems)
    OrderItems:OrderItem[]

    @Column({default : 5})
    tax:number;

    @Column({type:'enum', enum:MenuItemStatus})
    status: MenuItemStatus

    @Exclude()
    @Column(() => Dateschema)
    date: Dateschema

}