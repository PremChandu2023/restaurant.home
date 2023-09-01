import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { OrderServices } from "./order-service";
import { MenuDto, MenuItemDto, updatePaymentDTo } from "./orders.dtos";
import { MenuItems } from "../Entities/orders.entities/menuitem.entity";
import { OrderCustomInterceptor } from "./Interceptors/Order.Interceptor";
import { RecentsearchInterceptor } from "../interceptors/interceptor-menu";
import { Roles } from "../custom-decarators/custom-roles-decarator";
import { EmployeeAuthGuard } from "../Auth/auth.Guard";
import { RolesGuard } from "../guards/rolebased.guard";
import { Role } from "../Menu/enums/roles.enums";
import { OrderCustomdecator } from "./orders-swaggers/order-customdecarators";
import { updateOrderDto } from "./order-dtos/oders-updateDto";
import { createOrderDTo } from "./order-dtos/createOrderDto";
import { PaymentStatus } from "../Menu/enums/payment.enum";
import { AddItemDtos } from "./order-dtos/order-additemdtos";
import { OrderExceptionConstants } from "./constants/exceptionconstants/exception.constant";
import { DatabaseErrorConstants } from "./constants/exceptionconstants/databse.constants";

@ApiTags("Orders")
@ApiBearerAuth()
@Controller('/order')
@UseInterceptors(RecentsearchInterceptor)
// @UseGuards(EmployeeAuthGuard,RolesGuard)
export class OrderController {
    constructor(private orderService: OrderServices) { }


    @Roles(Role.Manager, Role.Waiter)
    @OrderCustomdecator('Post', '/')
    @Post('/')
    async createOrder(@Body() createOrder: createOrderDTo) {
        try
        {
            console.log('ehdvweghfv');
            
        return await this.orderService.createOrder(createOrder);
    }
    catch(error)
    {
        switch(error)
        {
            case DatabaseErrorConstants.CREATED_FAILED:
                throw new BadRequestException(error);
        }
    }
    }

    @Get()
    @Roles(Role.Manager)
    @OrderCustomdecator('Get', '')
    async getAllOrders() {
        return await this.orderService.getAllOrders();
    }

    @Roles(Role.Manager, Role.Waiter)
    @OrderCustomdecator('Get', '/:id')
    @Get('/:id')
    async getOrderDetailsById(@Param('id', ParseIntPipe) OrderId: number) {
        try{
            return this.orderService.getOrderById(OrderId)
        }
        catch(error)
        {
            switch(error)
            {
                case OrderExceptionConstants.ORDER_INVALID:
                    throw new BadRequestException(error);
            }
        }        
    }

    @Roles(Role.Manager, Role.Waiter)
    @OrderCustomdecator('Put', '/itemquantity:id')
    @Post('/itemquantity/:id')
    async updateOrderQuantity(@Param('id') orderItemId: number, @Body() updateOrder: updateOrderDto) {
        try {
            return await this.orderService.updateOrderQuantity(updateOrder, orderItemId);
        }
        catch (error) {
            switch (error) {
                case OrderExceptionConstants.ORDER_INVALID:
                    throw new BadRequestException({ message: error });
                case DatabaseErrorConstants.UPDATE_FAILED:
                    throw new InternalServerErrorException({ mesage: error })
                default:
                    throw new InternalServerErrorException({ message: 'An error occurred during the update.' })
            }
        }
    }
    /* Deletes the menuItm of the Given customer order
    * @OrderItem => it is the combined id  of orderid and particular menitem id that we want to delete*/
    @Roles(Role.Manager, Role.Waiter)
    @Delete(':orderitemid')
    @OrderCustomdecator('Delete', ':orderItemId')
    deleteMenuItem(@Param('menuItemid', ParseIntPipe) orderItemId: number) {
        return this.orderService.deleteMenuItem(orderItemId);
    }

    @Delete(':orderid')
    @OrderCustomdecator('Delete', ':Orderid')
    async deleteOrder(@Param('id', ParseIntPipe) orderId: number) {
        return await this.orderService.deleteOrderById(orderId);
    }

    //Approve the payment request
    @Patch('approved/:id')
    @OrderCustomdecator('Patch', 'approved/:id')
    updatePaymentStatus(@Param('id') id: number) {
        const updateStatus: updatePaymentDTo = {
            orderStatus: PaymentStatus.APPROVED
        }
        return this.orderService.updatePaymentandOrderStatus(updateStatus, id);
    }

    //Cancel the payment request
    @Patch('declined/:id')
    @OrderCustomdecator('Patch', 'declined/:id')
    updatePaymentdeStatus(@Param('id') id: number) {
        const updateStatus: updatePaymentDTo = {
            orderStatus: PaymentStatus.DECLINED
        }
        return this.orderService.updatePaymentandOrderStatus(updateStatus, id);
    }










    // @Roles(Role.Manager,Role.Waiter)
    // @OrderCustomdecator('Get','/byname/:name')
    // @Get('/byname/:name')
    // async getOrderDetailsByName(@Param('name') customerName: string) {
    //     return await this.orderService.getOrderByName(customerName)
    // }
    // @OrderCustomdecator('Put','/:id/addItem')
    // @Put('/:id/additem')
    // addMenuItem(@Param('id', ParseIntPipe) id:number,@Body() updateMenuItem:AddItemDtos)
    // {
    //     return this.orderService.addMenuItem(updateMenuItem,id);
    // }
}