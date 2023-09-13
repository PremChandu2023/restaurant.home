import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MenuItems } from "./menuitem.entity";
import { Exclude } from "class-transformer";
import { Dateschema } from "./date.entity";
import { Restaurant } from "../restaurant/Entities/restaurant.entity";

@Entity('menu')
export class Menu {

    @PrimaryGeneratedColumn()
    menu_id:number;

    @Column()
    menu_Type:string;

    @ManyToOne(() => Restaurant, (restaurants) => restaurants.menus)
    @JoinColumn({foreignKeyConstraintName: 'fk_restaurant'})
    restaurants:Restaurant
    
    @OneToMany(()=> MenuItems, (menuitems)=>menuitems.menus)
    menuItems:MenuItems[]

    @Exclude()
    @Column(() => Dateschema)
    date: Dateschema

}