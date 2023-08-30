import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Menu } from "../Entities/orders.entities/menu.entity";
import { ILike, Like, Repository } from "typeorm";
import { MenuItems } from "../Entities/orders.entities/menuitem.entity";
import { MenuDto, MenuItemDto } from "../Orders/orders.dtos";
import { classToPlain } from "class-transformer";
import { getMenuItemDto } from "./menu-dtos";

@Injectable()
export class MenuService {
    constructor(@InjectRepository(Menu) private menuRepository:Repository<Menu>,
    @InjectRepository(MenuItems) private menuItemsRepository:Repository<MenuItems>){}

    async createMenu(menu: MenuDto) {
        const newMenu = this.menuRepository.create({ menu_Type: menu.menu_name });

        return await this.menuRepository.save(newMenu);
    }
    async addMenuItem(menuItem: MenuItemDto, id: number) {
        const newMenu = await this.menuRepository.findOneBy({ menu_id: id })
        if(!newMenu)
        {
            throw new BadRequestException({error: 'Invalid Id',message : "Given_menuId_is_not_available_in_database"})
        }
        const newmenuItem = this.menuItemsRepository.create(menuItem);
        newmenuItem.menus = newMenu
        await this.menuRepository.save(newMenu);
        const savedMenuitem = await this.menuItemsRepository.save(newmenuItem);
        return savedMenuitem;
    }
   async getAllItems()
    {
        const result =await this.menuItemsRepository.find();
        console.log(result);
        
        return result;
    }
    async getMenuItemById(id:number)
    {
        // const newMenuItem = await this.menuItemsRepository.findOne({where : {menuitem_id : id}, relations : ['menus']})
        let newMenuItem :MenuItems ;
        if(id)
        {   
            newMenuItem = await this.menuItemsRepository.createQueryBuilder('menuitem').leftJoinAndSelect('menuitem.menus','menus').where('menuitem.menuitem_id = :menuid', {menuid : id}).getOne();
        } 
        if(!(newMenuItem.menus.menu_Type))
        {
            throw new BadRequestException({message :'Menutype_is_not_found_with_requested_id'});
        }
        if(!newMenuItem)
        {
            throw new HttpException({message : 'Given_id_is_not_found'}, HttpStatus.BAD_REQUEST)
        }
        const newMenuItems : getMenuItemDto = {
            menu_itemname : newMenuItem.menu_itemname,
            menuitem_id: newMenuItem.menuitem_id,
            menu_type : newMenuItem.menus.menu_Type,
            price: newMenuItem.price
        }
        return newMenuItems;
    }
    async getMenuItemsByCategory(category:string)
    {
        const newMenuItem = await this.menuRepository.find({where : {
            menu_Type : ILike(`%${category}%`)
        },relations: {menuItems:true}})

        if(newMenuItem.length === 0)
       {
            throw new BadRequestException({message : 'Given_Name_is_not_found'});
       }

        return newMenuItem;
    }
    async getMenuItemsByName(ItemName:string):Promise<MenuItems[]>
    {
        const newMenuItems =await this.menuItemsRepository.createQueryBuilder('menuitems').select().where('menuitems.menu_itemname LIKE :menu_itemname', {menu_itemname: `${ItemName}`}).getMany()

    //    const newMenuItems  =await this.menuItemsRepository.findBy({menu_itemname : ILike(`%${ItemName}%`)})
       if(newMenuItems.length === 0)
       {
            throw new BadRequestException({message : 'Given_Category_is_not_found'});
       }
       return newMenuItems;
    }


}