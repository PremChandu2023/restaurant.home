import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../Entities/menu.entity';
import { ILike, Like, Repository } from 'typeorm';
import { MenuItems } from '../Entities/menuitem.entity';
import { MenuDto, MenuItemDto } from '../Orders/orders.dtos';
import { classToPlain } from 'class-transformer';
import { getMenuItemDto } from './menu.dtos';
import { MenuExceptionConstants } from './Constants/exception.constants';
import { Order } from '../Entities/orders.entity';
import { OrderType } from './Constants/orders.type';
import { log } from 'winston';
import { MenuItemStatus } from './Enums/menuItem.status';
import { UpdateStatusDto } from './Dtos/updateStatusDtos';

@Injectable()
export class MenuService {
  logger: Logger;
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @InjectRepository(MenuItems)
    private menuItemsRepository: Repository<MenuItems>,
  ) {
    this.logger = new Logger(MenuService.name);
  }

  async createMenu(menu: MenuDto) {
    this.logger.log('Creating the menu');
    const newMenu = this.menuRepository.create({ menu_Type: menu.menu_name });
    this.logger.log('New menu has been created successfully');
    return await this.menuRepository.save(newMenu);
  }
  async addMenuItem(menuItem: MenuItemDto, id: number) {
    this.logger.log(`Adding the Menuitem using  menuitem id ${id}`);
    const newMenu = await this.menuRepository.findOneBy({ menu_id: id });
    if (!newMenu) {
      this.logger.log(MenuExceptionConstants.MENUID_NOTFOUND);
      throw MenuExceptionConstants.MENUID_NOTFOUND;
    }
    const newmenuItem = this.menuItemsRepository.create(menuItem);
    newmenuItem.menus = newMenu;
    await this.menuRepository.save(newMenu);
    const savedMenuitem = await this.menuItemsRepository.save(newmenuItem);
    this.logger.log('New Menuitem has been added successfully');
    return savedMenuitem;
  }
  async getAllItems() {
    this.logger.log(`Fetching all Menuitem details`);
    const result = await this.menuItemsRepository.find();
    return result;
  }
  async getMenuItemById(id: number) {
    // const newMenuItem = await this.menuItemsRepository.findOne({where : {menuitem_id : id}, relations : ['menus']})
    this.logger.log(`Fetching the Menuitem details using  menuitem id ${id}`);
    let newMenuItem: MenuItems;
    if (id) {
      newMenuItem = await this.menuItemsRepository
        .createQueryBuilder('menuitem')
        .innerJoinAndSelect('menuitem.menus', 'menus')
        .where('menuitem.menuitem_id = :menuid', { menuid: id })
        .getOne();
    }
    if (!newMenuItem) {
      this.logger.error(MenuExceptionConstants.MENUITEMID_NOTFOUND);
      throw MenuExceptionConstants.MENUITEMID_NOTFOUND;
    }
    if (!newMenuItem.menus.menu_Type) {
      this.logger.log(MenuExceptionConstants.CATEGORY_NOT_FOUND);
      throw MenuExceptionConstants.CATEGORY_NOT_FOUND;
    }
    const newMenuItems: getMenuItemDto = {
      menu_itemname: newMenuItem.menu_itemname,
      menuitem_id: newMenuItem.menuitem_id,
      menu_type: newMenuItem.menus.menu_Type,
      price: newMenuItem.price,
    };
    this.logger.log(
      `Completed the process of fetching the Menuitem details using  menuitem id ${id}`,
    );
    return newMenuItems;
  }
  /* A sub query for updating the orderstatus for all customers*/
  async updateStatus() {
    const updatedStatus = await this.menuItemsRepository
      .createQueryBuilder('menu')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select()
          .from(Order, 'order')
          .where('order.orderStatus = :status')
          .getQuery();
        return subQuery;
      })
      .setParameter('status', 'approved')
      .getMany();
    return updatedStatus;
  }
  async searchMenuItems(ItemName: string, category: string) {
    let queryBuilder = await this.menuItemsRepository.createQueryBuilder(
      'menuitems',
    );
    if (ItemName) {
      queryBuilder.andWhere('menuitems.menu_itemname LIKE :menu_itemname', {
        menu_itemname: `%${ItemName}%`,
      });
    }
    if (category) {
      queryBuilder.innerJoinAndSelect('menuitems.menus', 'menu');
      queryBuilder.andWhere('menu.menu_Type LIKE :menu_Type', {
        menu_Type: category,
      });
    }
    const filteredItems = await queryBuilder.getMany();
    if (filteredItems.length === 0) {
      throw new BadRequestException({
        message: 'Data is not found with given Request',
      });
    }
    return filteredItems;
  }

  /**
   *
   * @param category Category of menuItem with partial Category Name
   * @param ItemName ItemName with partial searching operation
   * @param price Give for low to high and high to low
   * @returns filtered Items based on above parameters
   */
  async getMenuItemByFilter(
    availableStatus?: string,
    priceMax?: number,
    priceMin?: number,
    filter?:string
  ): Promise<MenuItems[]> {
    let queryBuilder = this.menuItemsRepository.createQueryBuilder('menuitems');
    //joining with menu table
    // queryBuilder.innerJoinAndSelect('menuitems.menus','menus')

    // const filterBy = filter.split('&')
    

    // filterBy.forEach((options) => {
      
    //   queryBuilder.andWhere('menus.menu_Type = :menu_Type', {menu_Type : options})
    // })
    if (availableStatus) {
      queryBuilder.andWhere('menuitems.status = :status', {
        status: availableStatus,
      });
    }
    if (priceMax || priceMin) {
      if (priceMax && priceMin) {
        queryBuilder.andWhere(
          'menuitems.price BETWEEN :priceMin AND :priceMax',
          {
            priceMin: priceMin,
            priceMax: priceMax,
          },
        );
      } else if (priceMax) {
        queryBuilder.andWhere('menuitems.price <:priceMax', {
          priceMax: priceMax,
        });
      } else if (priceMin) {
        queryBuilder.andWhere('menuitems.price > :priceMin', {
          priceMin: priceMin,
        });
      }
    }
    const filteredItems = await queryBuilder.getMany();
    if (filteredItems.length === 0) {
      throw new BadRequestException({
        message: 'Data is not found with given Request',
      });
    }
    return filteredItems;
  }

  async updateAvailableStatus(
    availableStatus: UpdateStatusDto,
    id: number,
  ): Promise<any> {
    const updatedItem = await this.menuItemsRepository.findOne({
      where: { menuitem_id: id },
    });
    updatedItem.status = availableStatus.status;
    await this.menuItemsRepository.save(updatedItem);
    return updatedItem;
  }
}
