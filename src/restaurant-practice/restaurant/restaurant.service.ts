import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './Entities/restaurant.entity';
import { Repository } from 'typeorm';
import { AddMenuItemDto, createRestaurantDto } from './Dtos/resaturant.dto';
import { MenuItems } from '../Entities/menuitem.entity';
import { log } from 'winston';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRespository: Repository<Restaurant>,
    @InjectRepository(MenuItems)
    private menuItemsRespository: Repository<MenuItems>,
  ) {}

  async createRestaurant(
    createRestaurantDto: createRestaurantDto,
  ): Promise<Restaurant> {
    const newResta = await this.restaurantRespository.findOne({
      where: { name: createRestaurantDto.name },
    });

    if (newResta) {
      throw RestaurantExcepConst.RESATUARANT_ALREADY_EXIST;
    }
    const newRest = await this.restaurantRespository.create();
    newRest.location = createRestaurantDto.location;
    newRest.name = createRestaurantDto.name;

    return await this.restaurantRespository.save(newRest);
  }

  async addMenuItems(
    addMenuItemDto: AddMenuItemDto,
    restaurantId: number,
  ): Promise<Restaurant> {
    const newMenuitems = await this.restaurantRespository.findOne({
      where: { id: restaurantId },
    });
    console.log(newMenuitems);

    if (!newMenuitems) {
      throw RestaurantExcepConst.INVALID_RESATUARANT_ID;
    }

    const newMenuItem = await this.menuItemsRespository.create({
      menu_itemname: addMenuItemDto.menu_itemname,
      price: addMenuItemDto.price,
    });

    newMenuItem.restaurant = newMenuitems;
    await this.menuItemsRespository.save(newMenuItem);
    const savedMenuItem = await this.restaurantRespository.save(newMenuitems);
    return savedMenuItem;
  }

  /**
   *
   * @param id is menuItem id
   * @param price it is the price with which we want to filter the results
   * @returns a Promise of Restaurant of all details with given id or price
   */
  async getAllRestaurantDetails(
    id: number,
    price: number,
  ): Promise<Restaurant[]> {
    /**
     * innerJoin:
     * It returns only the primary entity (the entity you started the query with) and the joined entity, but it does not retrieve all the columns from the joined entity
     * in this case common records of resaturant  will be obtained but its menuitems will not be obatined
     * innerJoinAndSelect:
     * innerJoinAndSelect is used when you want to perform an inner join and also retrieve all columns from the joined entity.
     * in this case all common elements with resaturant and menuitems table and both sides table records will be obtained.
     */
    let conditionVariable: string;
    if (price) {
      conditionVariable = 'menu_Items.price < :parameter';
    } else if (id) {
      conditionVariable = 'menu_Items.menuitem_id = :parameter';
    }
    const newRest = await this.restaurantRespository
      .createQueryBuilder('restaurant')
      .innerJoinAndSelect('restaurant.menu_Items', 'menu_Items')
      .where(conditionVariable, { parameter: id || price })
      .getMany();

    return newRest;
  }
  /**
   *
   * @param id is restaurant id
   * with this all details of Restaurant from using nested inner join combined with all tables
   */
  async getRestaurantDetailsWithOrders(id: number) {
    // const newRestaDetails = await this.restaurantRespository
    //   .createQueryBuilder('restaurant')
    //   .innerJoinAndSelect('restaurant.orders', 'orders')
    //   .where('restaurant.id = :id', { id: 3 });

    const newRestaDetails = await this.restaurantRespository.find({
      loadRelationIds: {
        relations: ['restaurant.orders', 'orders.orderItems'],
      },
    });

    return newRestaDetails;
  }
}
