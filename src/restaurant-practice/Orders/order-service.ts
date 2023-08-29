import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Tablemenu } from "../Menu/table-menu";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryBuilder, Repository, Transaction } from "typeorm";
import { Menu } from "./orders.entities/menu.entity";
import { MenuItems } from "./orders.entities/menuitem.entity";
import { Order } from "./orders.entities/orders.entity";
import { OrderItem } from "./orders.entities/orderitem.entity";

import { MenuDto, MenuItemDto, orderDetails,  updatePaymentDTo } from "./orders.dtos";
import { OrderStatus } from "../Menu/enums/order.enum";
import { PaymentStatus } from "../Menu/enums/payment.enum";
import { plainToClass } from "class-transformer";
import { updateOrderDto } from "./order-dtos/oders-updateDto";
import { createOrderDTo } from "./order-dtos/createOrderDto";
import { getOrderDto } from "./order-dtos/getOrderdto";


@Injectable()
export class OrderServices {
    constructor(@InjectRepository(Menu) private menuRespository: Repository<Menu>, @InjectRepository(MenuItems) private menuItemRespository: Repository<MenuItems>, @InjectRepository(Order) private orderRespository: Repository<Order>,@InjectRepository(OrderItem) private orderItemRespository: Repository<OrderItem>, private datasource:DataSource) { }

    createMenu(menu: MenuDto) {
        // console.log(menu);

        const newMenu = this.menuRespository.create({ menu_Type: menu.menu_name });

        return this.menuRespository.save(newMenu);
    }
    async createMenuItem(menuItem: MenuItemDto, id: number) {
        const newMenu = await this.menuRespository.findOneBy({ menu_id: id })
        const newmenuItem = this.menuItemRespository.create(menuItem);
        newmenuItem.menus = newMenu
        await this.menuRespository.save(newMenu);
        const savedMenuitem = await this.menuItemRespository.save(newmenuItem);
        return savedMenuitem;
    }
    async createOrder(createOrder: createOrderDTo) {
        try{
        const newOrder = this.orderRespository.create();
        newOrder.customerName = createOrder.customerName;
        newOrder.tableNumber=createOrder.tableNumber;       
        const savedOrder = await this.orderRespository.save(newOrder);

        for (const OrderItemdata of createOrder.items) {
            const newOrderItem = this.orderItemRespository.create()
            const menuItemId = OrderItemdata.menuItemId;

            const menuItem = await this.menuItemRespository.findOne({ where: { menuitem_id: menuItemId } })
            if(!menuItem)
            {
                throw new BadRequestException('Invalid_menuItem_no_data_is_found_with_given_menuItem');
            }
            newOrderItem.orders = savedOrder
            newOrderItem.menuitems = menuItem
            newOrderItem.quantity = OrderItemdata.quantity
            await this.orderItemRespository.save(newOrderItem);
        }
        return newOrder;
        }
        catch(error)
        {
            throw new InternalServerErrorException('failed_to_create_order')
        }
    }

    async getOrderById(OrderId: number) {
          const newOrder = await this.orderRespository.findOne({where: {
                order_id: OrderId
            },relations : ['orderItems',  'orderItems.menuitems']})
            if(!newOrder)
            {
                throw new  NotFoundException('Invalid id Order with given id is not available');
            }
           
                const transformOrder =await plainToClass(Order,newOrder, {excludeExtraneousValues :false})
            return transformOrder;

        // return await this.orderItemRespository.createQueryBuilder('oi').where('oi.orderItem_id = :id', {id: OrderId}).getMany()
        // return await this.orderItemRespository.createQueryBuilder('orderitems').select(['orderitems.orderItem_id', 'orderitems.quantity']).where('orderitems.orderItem_id =:id', { id: OrderId }).getOne();
    }

    //
    async getOrderByName(Name: string) {
        const newOrder = await this.orderRespository.findOne({
            where: {
                customerName: Name
            }, relations: ['orderItems', 'orderItems.menuitems', 'orderItems.menuitems.menus']
        })
        // console.log(newOrder);
        // const newMenuItem = await this.menuItemRespository.find({where : {
        // }})

        // const newOrder = await this.orderRespository.createQueryBuilder('order').leftJoin('order.orderItems', 'orderitems').leftJoin('orderitems.menuitems', 'menuitems').where('order.customerName = :customerName').setParameter('customerName' , Name).getOne();
        const newOrderItems: orderDetails[] = newOrder.orderItems.map(item => ({
            order_Name: item.menuitems.menu_itemname,
            price: item.menuitems.price * item.quantity,
            tax : item.menuitems.price * 0.05
        }))

       const totalPrice=await  this.calculatePrice(newOrderItems,newOrder)
      // const totalPrice = newOrderItems.reduce((accum, item) => accum+item.price, 0)

        const OrderReciept: getOrderDto = {
            order_Id: newOrder.order_id,
            customer_Name: newOrder.customerName,
            orderDetails: newOrderItems,
            totalPrice: totalPrice
        }
        return OrderReciept;
    }
    async updateOrderQuantity(updateOrder: updateOrderDto, customerName: string) {
        const newOrderid = await this.orderRespository.findOne({
            where: {
                customerName: customerName,
            }, select: { order_id: true }
        })
        // console.log(newOrderid);
        
        if(!newOrderid)
        {
            throw new BadRequestException('Id_with_given_customerName_is_not_avalaible');
        }
        const newOrderItems = await this.orderItemRespository.findOne({
            where: {
                orders: { order_id: newOrderid.order_id }, menuitems: { menu_itemname: updateOrder.menuItem }
            }
        })
        
        if(!newOrderItems)
        {
            throw new BadRequestException('Invalid_Menuitem_name');
        }
        newOrderItems.quantity = updateOrder.quantity;
        const savedOrder = await this.orderItemRespository.save(newOrderItems);
        const transformOrder =await plainToClass(Order,savedOrder, {excludeExtraneousValues :false})
        return transformOrder;

    }
    
    async addMenuItem(updateMenuItem:updateOrderDto,id:number)
    {
        return "";
    }
    async deleteMenuItem(orderItemId:number){
        const newOrderItem = await this.orderItemRespository.findOne({where : {orderItem_id : orderItemId}});
        if(!newOrderItem)
        {
            throw new HttpException({message :"Invalid_OrderItemId" },HttpStatus.BAD_REQUEST);
        }
        return {message : "Menu Item deleted successfully"};
    }
    async deleteOrderById(odrerId:number)
    {
        const newOrder = await this.orderRespository.delete({order_id : odrerId})
        if(!newOrder)
        {
            throw new BadRequestException({message : 'order_with_given_id_is_not_found'})
        }
        return newOrder;
    }    
    async updatePaymentandOrderStatus(updateBody:updatePaymentDTo, orderId : number,)
    {
     return this.datasource.transaction(async (manager) => {
        // if(!Object.values(PaymentStatus).includes(updateBody.orderStatus))
        // {
        //     throw new BadRequestException('Given_orderstatus_is_Invalid');
        // }
        // const order = await this.orderRespository.findOne({ where : {order_id : orderId}})   
        // if( !order)
        // {
        //     throw new HttpException('given_id_not_found', HttpStatus.NOT_FOUND);
        // }
        const newOrder = await this.orderRespository.findOne({where : { order_id: orderId}});
        if(!newOrder)
        {
            throw new BadRequestException({message : 'Given_order_id_not_found'});
        }
        const result = await manager
        .createQueryBuilder()
        .update(Order) 
        .set({paymentStatus : updateBody.orderStatus,orderStatus : OrderStatus.COMPLETED}) 
        .where('order_id = :id', { id: orderId }) 
        .execute();
        if(result.affected === 1)
        {

            return 'payment_status_updated_successfully';
        }
        else{
            return 'failed_to_update_payment_status';
        }

     })   
        
    }
   async calculatePrice(newOrderItems:orderDetails[], newOrder: Order){
    console.log(newOrder.customerName);
    const totalPrice = newOrderItems.reduce((accum, item) => accum+item.price, 0)
    const totaltax = newOrderItems.reduce((accum, item) => accum+item.tax, 0) 
    return totalPrice+totaltax;

   }
}


