import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { OrderServices } from "./order-service";
import { MenuDto, MenuItemDto, updatePaymentDTo } from "./orders.dtos";
import { MenuItems } from "../Entities/menuitem.entity";
import { OrderCustomInterceptor } from "./Interceptors/Order.Interceptor";
import { RecentsearchInterceptor } from "../interceptors/interceptor-menu";
import { Roles } from "../custom-decarators/customroles.decarator";
import { EmployeeAuthGuard } from "../Auth/Auth.guards/auth.guard";
import { RolesGuard } from "../guards/rolebased.guard";
import { Role } from "../Menu/enums/roles.enums";
import { OrderCustomdecator } from "./orders-swaggers/order-customdecarators";
import { updateOrderDto } from "./order-dtos/oders-updateDto";
import { createOrderDTo } from "./order-dtos/createOrderDto";
import { PaymentStatus } from "../Menu/enums/payment.enum";
import { AddItemDtos } from "./order-dtos/order-additemdtos";
import { OrderExceptionConstants } from "./constants/exceptionconstants/exception.constant";
import { DatabaseErrorConstants } from "./constants/exceptionconstants/databse.constants";
import { OrderItemDTo } from "./order-dtos/orderItemDto";

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
        try {
            return await this.orderService.createOrder(createOrder);
        }
        catch (error) {
            switch (error) {
                case DatabaseErrorConstants.CREATED_FAILED:
                    throw new BadRequestException(error);
                case OrderExceptionConstants.MENUITEM_INVALID:
                    throw new BadRequestException(error);

                default:
                    throw new InternalServerErrorException(error);
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
        try {
            return await this.orderService.getOrderById(OrderId)
        }
        catch (error) {
            switch (error) {
                case OrderExceptionConstants.ORDER_INVALID:
                    throw new NotFoundException({ message: error });
                default:
                    throw new InternalServerErrorException({ message: 'Cannot get the order details of the particular id' });
            }
        }
    }
    /*Updates the 'quanity' of a particluar orderItem with given menuitem name and orderItem id */
    @Roles(Role.Manager, Role.Waiter)
    @OrderCustomdecator('Put', '/itemquantity:id')
    @Put('/quantity/:id')
    async updateOrderQuantity(@Param('id') orderItemId: number, @Body() updateOrder: updateOrderDto) {
        try {
            return await this.orderService.updateOrderQuantity(updateOrder, orderItemId);
        }
        catch (error) {
            switch (error) {
                case OrderExceptionConstants.ORDER_INVALID:
                    throw new NotFoundException({ message: error });
                case DatabaseErrorConstants.UPDATE_FAILED:
                    throw new InternalServerErrorException({ mesage: error })
                default:
                    throw new InternalServerErrorException({ message: 'An error occurred during the update.' })
            }
        }
    }
    /* Deletes the menuItem of the Given customer order
    * @OrderItem => it is the combined id  of orderid and particular menitem id that we want to delete*/
    @Roles(Role.Manager, Role.Waiter)
    @Delete('/orderitem/:id')
    @OrderCustomdecator('Delete', ':orderItemId')
    async deleteMenuItem(@Param('id', ParseIntPipe) orderItemId: number) {
        try {
            return await this.orderService.deleteMenuItem(orderItemId);
        }
        catch (error) {
            switch (error) {
                case OrderExceptionConstants.ORDERITEM_INVALID:
                    throw new NotFoundException(error);
                default:
                    throw new InternalServerErrorException(error);
            }
        }
    }

    @Delete('/:id')
    @OrderCustomdecator('Delete', ':Orderid')
    async deleteOrder(@Param('id', ParseIntPipe) orderId: number) {
        try {
            return await this.orderService.deleteOrderById(orderId);
        }
        catch (error) {
            switch (error) {
                case OrderExceptionConstants.ORDER_INVALID:
                    throw new NotFoundException(error);
            }
        }
    }
    //Approve the payment request
    @Patch('approved/:id')
    @OrderCustomdecator('Patch', 'approved/:id')
    async updatePaymentStatus(@Param('id') id: number) {
        try{
            const updateStatus: updatePaymentDTo = {
                orderStatus: PaymentStatus.APPROVED
            }
            return await this.orderService.updatePaymentandOrderStatus(updateStatus, id);
        }
        catch(error)
        {
            throw new NotFoundException(error);
        }
        
    }

    //Cancel the payment request
    @Patch('declined/:id')
    @OrderCustomdecator('Patch', 'declined/:id')
    async updatePaymentdeStatus(@Param('id') id: number) {
        try{
        const updateStatus: updatePaymentDTo = {
            orderStatus: PaymentStatus.DECLINED
        }
        return await this.orderService.updatePaymentandOrderStatus(updateStatus, id);
    }
    catch(error)
    {
        throw new NotFoundException(error);
    }
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