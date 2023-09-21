import { Exclude } from 'class-transformer';
import { Dateschema } from 'src/Restaurant/Entities/date.entity';
import { Menu } from 'src/Restaurant/Entities/menu.entity';
import { MenuItems } from 'src/Restaurant/Entities/menuitem.entity';
import { Order } from 'src/Restaurant/Entities/orders.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurant')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @OneToMany(() => Menu, (menu) => menu.restaurants)
  menus: Menu[];

  @OneToMany(() => MenuItems, (menuitems) => menuitems.restaurant)
  menu_Items: MenuItems[];

  @OneToMany(() => Order, (orders) => orders.restaurant)
  orders: Order[];

  @Exclude()
  @Column(() => Dateschema)
  date: Dateschema;
}
