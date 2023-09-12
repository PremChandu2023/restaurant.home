import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, QueryBuilder, Repository, Transaction } from "typeorm";
import { Menu } from "../Entities/menu.entity";
import { MenuItems } from "../Entities/menuitem.entity";
import { Order } from "../Entities/orders.entity";
import { OrderItem } from "../Entities/orderitem.entity";

import { MenuDto, MenuItemDto, orderDetails, updatePaymentDTo } from "./orders.dtos";
import { OrderStatus } from "../Enums/order.enum";
import { PaymentStatus } from "../Enums/payment.enum";
import { plainToClass } from "class-transformer";
import { AddItemDtos, createOrderDTo, getOrderDto, updateOrderDto } from "./Dtos/order.dto";
import { OrderExceptionConstants } from "./constants/exceptionconstants/exception.constant";
import { DatabaseErrorConstants } from "./constants/exceptionconstants/databse.constants";


@Injectable()
export class OrderServices {
    logger: Logger;
    constructor(@InjectRepository(Menu) private menuRespository: Repository<Menu>, @InjectRepository(MenuItems) private menuItemRespository: Repository<MenuItems>, @InjectRepository(Order) private orderRespository: Repository<Order>, @InjectRepository(OrderItem) private orderItemRespository: Repository<OrderItem>, private datasource: DataSource) {
        this.logger = new Logger(OrderServices.name);
    }

    createMenu(menu: MenuDto) {
        // console.log(menu);
        this.logger.log('Creates a new Menu')
        const newMenu = this.menuRespository.create({ menu_Type: menu.menu_name });

        return this.menuRespository.save(newMenu);
    }
    async createMenuItem(menuItem: MenuItemDto, id: number) {
        this.logger.log(`Fetching the Menuitem details using  menuitem id ${id}`)
        const newMenu = await this.menuRespository.findOneBy({ menu_id: id })
        const newmenuItem = this.menuItemRespository.create(menuItem);
        newmenuItem.menus = newMenu
        await this.menuRespository.save(newMenu);
        const savedMenuitem = await this.menuItemRespository.save(newmenuItem);
        return savedMenuitem;
    }
    async createOrder(createOrder: createOrderDTo) {
        this.logger.log("Initializes the process of creating a new Order");
        const newOrder = this.orderRespository.create();
        newOrder.customerName = createOrder.customerName;
        newOrder.tableNumber = createOrder.tableNumber;
        const savedOrder = await this.orderRespository.save(newOrder);
        if (!savedOrder) {
            this.logger.log(DatabaseErrorConstants.CREATED_FAILED)
            throw DatabaseErrorConstants.CREATED_FAILED;
        }
        for (const OrderItemdata of createOrder.items) {
            const newOrderItem = this.orderItemRespository.create()
            const menuItemId = OrderItemdata.menuItemId;

            const menuItem = await this.menuItemRespository.findOne({ where: { menuitem_id: menuItemId } })
            if (!menuItem) {
                this.logger.log(OrderExceptionConstants.MENUITEM_INVALID)
                throw OrderExceptionConstants.MENUITEM_INVALID;
            }
            newOrderItem.orders = savedOrder
            newOrderItem.menuitems = menuItem
            newOrderItem.quantity = OrderItemdata.quantity
            await this.orderItemRespository.save(newOrderItem);
        }
        this.logger.log("New Order created succesfully");
        return newOrder;
    }
    async getAllOrders(): Promise<Order[]> {
        this.logger.log("Initializes the process of fetching all Orders");
        const allOrders = await this.orderRespository.find({ relations: { orderItems: { menuitems: true } } })

        // const allOrders = await this.orderRespository.createQueryBuilder('order').innerJoinAndSelect('order.orderItems', 'orderItems').getMany();
        this.logger.log('All orders are fetched successfully');
        return allOrders;
    }

    async getOrderById(OrderId: number) {
        this.logger.log(`Initializes the process of fetching Order by id ${OrderId}`);
        const newOrder = await this.orderRespository.findOne({
            where: {
                order_id: OrderId,
            }, relations: ['orderItems', 'orderItems.menuitems']
        })

        if (!newOrder) {
            this.logger.log(OrderExceptionConstants.ORDER_INVALID);
            throw OrderExceptionConstants.ORDER_INVALID;
        }

        const transformOrder = await plainToClass(Order, newOrder, { excludeExtraneousValues: false })
        this.logger.log("Completed the process of creating a new Order");
        return transformOrder;

        // return await this.orderItemRespository.createQueryBuilder('oi').where('oi.orderItem_id = :id', {id: OrderId}).getMany()
        // return await this.orderItemRespository.createQueryBuilder('orderitems').select(['orderitems.orderItem_id', 'orderitems.quantity']).where('orderitems.orderItem_id =:id', { id: OrderId }).getOne();
    }

    /* calculation of bill */
    async getBillById(OrderId: number) {
        this.logger.log(`Initializes the process of creating a new Bill by using given ${OrderId}`);
        const newOrder = await this.orderRespository.findOne({
            where: {
                order_id: OrderId
            }, relations: { orderItems: { menuitems: true } }
        })
        if (!newOrder) {
            this.logger.log(OrderExceptionConstants.ORDER_INVALID)
            throw OrderExceptionConstants.ORDER_INVALID;
        }
        // const newOrder = await this.orderRespository.createQueryBuilder('order').leftJoin('order.orderItems', 'orderitems').leftJoin('orderitems.menuitems', 'menuitems').where('order.customerName = :customerName').setParameter('customerName' , Name).getOne();
        const newOrderItems: orderDetails[] = newOrder.orderItems.map(item => ({
            order_Name: item.menuitems.menu_itemname,
            price: item.menuitems.price * item.quantity,
            tax: item.menuitems.price * 0.05
        }))

        const totalPrice = await this.calculatePrice(newOrderItems, newOrder)
        // const totalPrice = newOrderItems.reduce((accum, item) => accum+item.price, 0)

        const OrderReciept: getOrderDto = {
            order_Id: newOrder.order_id,
            customer_Name: newOrder.customerName,
            orderDetails: newOrderItems,
            totalPrice: totalPrice,
            paymentStatus: ''
        }
        this.logger.log("Completed the process of creating a new OrderReciept");
        return OrderReciept;
    }
    async updateOrderQuantity(updateOrder: updateOrderDto, orderItemId: number) {
        this.logger.log("Initializes the process of updating a new Order");
        const newOrderItem = await this.orderItemRespository.findOne({ where: { orderItem_id: orderItemId, menuitems: { menu_itemname: updateOrder.menuItem } } });
        if (!newOrderItem) {
            throw OrderExceptionConstants.ORDER_INVALID
        }
        // const updateQuantity = await this.orderItemRespository.update({quantity:updateOrder.quantity},{orderItem_id: orderItemId})

        newOrderItem.quantity = updateOrder.quantity
        const updateQuantity = await this.orderItemRespository.save(newOrderItem);
        if (!updateQuantity) {
            this.logger.log(DatabaseErrorConstants.UPDATE_FAILED);
            throw DatabaseErrorConstants.UPDATE_FAILED;
        }
        this.logger.log('Updated the quantity of order succesfully')
        return updateQuantity;
    }

    async deleteMenuItem(orderItemId: number) {
        this.logger.log(`Deleting the MenuItem with given orderItemId ${orderItemId}`);
        const newOrderItem = await this.orderItemRespository.findOne({ where: { orderItem_id: orderItemId } });
        if (!newOrderItem) {
            this.logger.log(OrderExceptionConstants.ORDERITEM_INVALID)
            throw OrderExceptionConstants.ORDERITEM_INVALID;
        }
        this.logger.log('MenuItem deleted successfully');
        return { message: "Menu Item deleted successfully" };
    }
    async deleteOrderById(odrerId: number) {
        this.logger.log(`Deleting the Orderitem with given orderItemId ${odrerId}`);
        const newOrder = await this.orderRespository.delete({ order_id: odrerId })

        if (newOrder.affected === 0) {
            throw OrderExceptionConstants.ORDER_INVALID;
        }
        this.logger.log(`Order deleted successfully`);
        return { message: 'Order deleted successfully' };
    }
    async updatePaymentandOrderStatus(updateBody: updatePaymentDTo, orderId: number,) {
        this.logger.log('Initializes the process of updating the payment and order status');
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
            const newOrder = await this.orderRespository.findOne({ where: { order_id: orderId } });
            if (!newOrder) {
                throw OrderExceptionConstants.ORDER_INVALID;
            }
            const result = await manager
                .createQueryBuilder()
                .update(Order)
                .set({ paymentStatus: updateBody.orderStatus, orderStatus: OrderStatus.COMPLETED })
                .where('order_id = :id', { id: orderId })
                .execute();
            if (result.affected === 1) {
                const bill = await this.getBillById(orderId);
                bill.paymentStatus = PaymentStatus.APPROVED
                return bill;
            }
            else {
                return 'failed_to_update_payment_status';
            }

        })

    }
    async calculatePrice(newOrderItems: orderDetails[], newOrder: Order) {
        this.logger.log('Calaculating the price details');
        const totalPrice = newOrderItems.reduce((accum, item) => accum + item.price, 0)
        const totaltax = newOrderItems.reduce((accum, item) => accum + item.tax, 0)
        return totalPrice + totaltax;

    }
}


