import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Menu } from "../Entities/menu.entity";
import { ILike, Like, Repository } from "typeorm";
import { MenuItems } from "../Entities/menuitem.entity";
import { MenuDto, MenuItemDto } from "../Orders/orders.dtos";
import { classToPlain } from "class-transformer";
import { getMenuItemDto } from "./menu.dtos";
import { MenuExceptionConstants } from "./Constants/exception.constants";
import { Order } from "../Entities/orders.entity";

@Injectable()
export class MenuService {
    logger:Logger
    constructor(@InjectRepository(Menu) private menuRepository:Repository<Menu>,
    @InjectRepository(MenuItems) private menuItemsRepository:Repository<MenuItems>){
        this.logger = new Logger(MenuService.name)
    }

    async createMenu(menu: MenuDto) {
        this.logger.log('Creating the menu');
        const newMenu = this.menuRepository.create({ menu_Type: menu.menu_name });
        this.logger.log('New menu has been created successfully');
        return await this.menuRepository.save(newMenu);
    }
    async addMenuItem(menuItem: MenuItemDto, id: number) {
        this.logger.log(`Adding the Menuitem using  menuitem id ${id}`)
        const newMenu = await this.menuRepository.findOneBy({ menu_id: id })
        if(!newMenu)
        {
            this.logger.log(MenuExceptionConstants.MENUID_NOTFOUND);
            throw MenuExceptionConstants.MENUID_NOTFOUND;
        }
        const newmenuItem = this.menuItemsRepository.create(menuItem);
        newmenuItem.menus = newMenu
        await this.menuRepository.save(newMenu);
        const savedMenuitem = await this.menuItemsRepository.save(newmenuItem);
        this.logger.log('New Menuitem has been added successfully')
        return savedMenuitem;
    }
   async getAllItems()
    {
        this.logger.log(`Fetching all Menuitem details`)
        const result =await this.menuItemsRepository.find();       
        return result;
    }
    async getMenuItemById(id:number)
    {
        // const newMenuItem = await this.menuItemsRepository.findOne({where : {menuitem_id : id}, relations : ['menus']})
       this.logger.log(`Fetching the Menuitem details using  menuitem id ${id}`)
        let newMenuItem :MenuItems;
        if(id)
        {   
            newMenuItem = await this.menuItemsRepository.createQueryBuilder('menuitem').leftJoinAndSelect('menuitem.menus','menus').where('menuitem.menuitem_id = :menuid', {menuid : id}).getOne();
        } 
        if(!newMenuItem)
        {
            this.logger.error(MenuExceptionConstants.MENUITEMID_NOTFOUND);
            throw MenuExceptionConstants.MENUITEMID_NOTFOUND;
        }
        if(!(newMenuItem.menus.menu_Type))
        {
            this.logger.log(MenuExceptionConstants.CATEGORY_NOT_FOUND)
            throw MenuExceptionConstants.CATEGORY_NOT_FOUND;
        }
        const newMenuItems : getMenuItemDto = {
            menu_itemname : newMenuItem.menu_itemname,
            menuitem_id: newMenuItem.menuitem_id,
            menu_type : newMenuItem.menus.menu_Type,
            price: newMenuItem.price
        }
        this.logger.log(`Completed the process of fetching the Menuitem details using  menuitem id ${id}`)
        return newMenuItems;
    }
    async getMenuItemsByCategory(category:string)
    {
        const newMenuItem = await this.menuRepository.find({where : {
            menu_Type : ILike(`%${category}%`)
        },relations: {menuItems:true}})

        if(newMenuItem.length === 0)
       {
            throw MenuExceptionConstants.CATEGORY_NOT_FOUND
       }

        return newMenuItem;
    }
    async getMenuItemsByName(ItemName:string):Promise<MenuItems[]>
    {
        this.logger.log(`Fetching the Menuitem details by name of the menuitem by partial sort`)
        const newMenuItems =await this.menuItemsRepository.createQueryBuilder('menuitems').select().where('menuitems.menu_itemname LIKE :menu_itemname', {menu_itemname: `%${ItemName}%`}).getMany()

    //    const newMenuItems  =await this.menuItemsRepository.findBy({menu_itemname : ILike(`%${ItemName}%`)})
       if(newMenuItems.length === 0)
       {
            this.logger.log(MenuExceptionConstants.MENUITEMID_NOTFOUND);
            throw MenuExceptionConstants.MENUITEMNAME_NOTFOUND;
       }
       return newMenuItems;
    }
    //flitering the results by price 
    async filterByPrice(price:number)
    {
        //select * from menuitems ORDER BY price DESC OFFSET 1 ROWS FETCH 2 ROWS 
        const menuItems = await this.menuItemsRepository.find({order: {price:'DESC'},skip: 1, take: 2})
        const newMenuitem = await this.menuItemsRepository.createQueryBuilder('menu').orderBy('menu.price','DESC').skip(1).take(1).getMany()
        console.log(newMenuitem);
    }
    /* A sub query for updating the orderstatus for all customers*/
    async updateStatus()
    {
        const updatedStatus = await this.menuItemsRepository.createQueryBuilder('menu').where((qb) => {
            const subQuery = qb.subQuery().select().from(Order,'order').where('order.orderStatus = :status').getQuery();
        return subQuery}).setParameter('status','approved').getMany();
             return updatedStatus
    }

}