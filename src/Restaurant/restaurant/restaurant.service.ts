import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './Entities/restaurant.entity';
import { Repository } from 'typeorm';
import {
  AddMenuItemDto,
  OrdersCountDto,
  createRestaurantDto,
} from './Dtos/resaturant.dto';
import { MenuItems } from '../Entities/menuitem.entity';
import { Employee } from '../Entities/employee.entity';
import { log } from 'winston';
import { Roles } from '../Entities/roles.entity';
import { orderDetails } from '../Orders/orders.dtos';
import { Rating } from '../Entities/ratings.entity';
import { RatingDto, createRatingDto } from '../Orders/Dtos/order.dto';
import { OrderItem } from '../Entities/orderitem.entity';
import { OrderExceptionConstants } from '../Orders/constants/exceptionconstants/exception.constant';
import { filterOptions } from './Constants/filters.constants';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRespository: Repository<Restaurant>,
    @InjectRepository(MenuItems)
    private menuItemsRespository: Repository<MenuItems>,
    @InjectRepository(Roles)
    private roleRespository: Repository<Roles>,
    @InjectRepository(Employee)
    private employeeRespository: Repository<Employee>,
    @InjectRepository(Rating)
    private ratingRespository: Repository<Rating>,
    @InjectRepository(OrderItem)
    private orderItemRespository: Repository<OrderItem>,
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
    const newResta = await this.restaurantRespository.findOne({
      where: { id: restaurantId },
    });
    console.log(newResta);

    if (!newResta) {
      throw RestaurantExcepConst.INVALID_RESATUARANT_ID;
    }

    const newMenuItem = await this.menuItemsRespository.create({
      menu_itemname: addMenuItemDto.menu_itemname,
      price: addMenuItemDto.price,
    });

    newMenuItem.restaurant = newResta;
    await this.menuItemsRespository.save(newMenuItem);
    const savedMenuItem = await this.restaurantRespository.save(newResta);
    return savedMenuItem;
  }

   /**
     * innerJoin:
     * It returns only the primary entity (the entity you started the query with) and the joined entity, but it does not retrieve all the columns from the joined entity
     * in this case common records of resaturant  will be obtained but its menuitems will not be obatined
     * innerJoinAndSelect:
     * innerJoinAndSelect is used when you want to perform an inner join and also retrieve all columns from the joined entity.
     * in this case all common elements with resaturant and menuitems table and both sides table records will be obtained.
     */
  /**
   *
   * @param id is menuItem id
   * @param price it is the price with which we want to filter the results
   * @returns a Promise of Restaurant of all details with given id or price
   */
  async getAllRestaurantDetails(
   query:any
  ): Promise<Restaurant[]> {
    let condition: string;
    
   const filterKeys:string[] =Object.keys(query)

    if (filterKeys.includes('price')) {
      condition = 'menu_Items.price < :parameter';
    } else if (filterKeys.includes('id')) {
      condition = 'menu_Items.menuitem_id = :parameter';
    }
    const newRest = await this.restaurantRespository
      .createQueryBuilder('restaurant')
      .innerJoinAndSelect('restaurant.menu_Items', 'menu_Items')
      .where(condition, { parameter: query['price'] || query['id'] })
      .getMany();

    return newRest;
  }
  /**
   *
   * @param id is restaurant id
   * @desc with this all details of Restaurant with order details from using nested inner join combined with all tables
   */
  async getRestaurantDetailsWithOrders(id: number): Promise<Restaurant> {


    const newRestaDetails = await this.restaurantRespository
      .createQueryBuilder('restaurant')
      .innerJoinAndSelect('restaurant.orders', 'orders')
      .innerJoinAndSelect('orders.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.menuitems', 'menuitems')
      .where('restaurant.id = :id', { id: id })
      .select([
        'restaurant.name',
        'restaurant.location',
        'orders.customerName',
        'orderItems.orders',
        'orderItems.quantity',
        'menuitems.menu_itemname',
        'menuitems.price',
      ])
      .getOne();

    return newRestaDetails;
  }
  /**
   *
   * @param roleId Id of the role with we want to search
   * @returns Array of Employee of a particular roleId
   */
  async getEmployeeByRoleId(roleId: number) {
    const employees = await this.roleRespository
      .createQueryBuilder('role')
      .innerJoinAndSelect('role.employees', 'employees')
      .where('role.id = :id', { id: roleId })
      .getMany();

    // const updateRole = await this.roleRespository
    //   .createQueryBuilder('role')
    //   .relation('employees')
    //   .of(3)
    //   .add(4);
    return employees;
  }
  async getTotalOrdersCount() {
    const orderCount = await this.restaurantRespository
      .createQueryBuilder('restaurant')
      .innerJoinAndSelect('restaurant.orders', 'orders')
      .innerJoinAndSelect('orders.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.menuitems', 'menuitems')
      .select([
        'restaurant.name',
        'COUNT(*) AS total_count',
        'AVG(orderItems.quantity * menuitems.price) AS averagePrice',
      ])
      .groupBy('restaurant.name')
      .orderBy('averagePrice')
      .getRawMany();

    return orderCount;
  }
  /**
   * Group Orders by Month and Year
   * Group orders by month and year to analyze orders trends over time.
   */
  async getOrdersByTime() {
    const orderResults = await this.restaurantRespository
      .createQueryBuilder('restaurant')
      .innerJoinAndSelect('restaurant.orders', 'orders')
      .innerJoinAndSelect('orders.orderItems', 'orderItems')
      .innerJoinAndSelect('orderItems.menuitems', 'menuitems')
      .select([
        'restaurant.name',
        'EXTRACT (MONTH FROM orders.createdDate) AS month',
        'COUNT(*) AS total',
      ])
      .groupBy('restaurant.name,month')
      .orderBy('total')
      .getRawMany();
    return orderResults;
  }

  /**
   *
   * @param ratingDto It contains the restaurant ratings for menuItems of particular order wrapped together in a dtos class
   * @param restaurantId Id of the resaturant form which is order placed
   */
  async createRating(ratingDto: createRatingDto, restaurantId: number) {
    const ratings = [];

    for (const items of ratingDto.orderItems) {
      const newOrderItem = await this.orderItemRespository.findOne({
        where: { orderItem_id: items.orderItemId },
      });
      if (!newOrderItem) {
        throw new BadRequestException(
          OrderExceptionConstants.ORDERITEM_INVALID,
        );
      }

      const newRating = await this.ratingRespository.create({
        orderItem: newOrderItem,
        value: items.reviews.ratingValue,
        review: items.reviews.review,
        restaurant: {id:restaurantId}
      });
      const rating = await this.ratingRespository.save(newRating);
      ratings.push(rating);
    }
    return ratings;
  }
}
