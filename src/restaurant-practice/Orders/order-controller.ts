import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { OrderServices } from "./order-service";
import { MenuDto, MenuItemDto, updatePaymentDTo } from "./orders.dtos";
import { MenuItems } from "../Entities/menuitem.entity";
import { OrderCustomInterceptor } from "./Interceptors/order.Interceptor";
import { RecentsearchInterceptor } from "../Interceptors/menu.interceptor";
import { Roles } from "../Auth/Customdecarators/customroles.decarator";
import { EmployeeAuthGuard } from "../guards/Auth.guards/auth.guard";
import { RolesGuard } from "../guards/Auth.guards/rolebased.guard";
import { Role } from "../Enums/roles.enums";
import { OrderCustomdecator } from "./orders-swaggers/order-customdecarators";
import { createOrderDTo, updateOrderDto } from "./order.dtos/order.dto";
import { PaymentStatus } from "../Enums/payment.enum";
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
            return await this.orderService.getOrderById(OrderId);
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
    @Put('/quantity/:orderitemid')
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
    @Delete('/order-item/:id')
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
    @Patch(':id/approved')
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
    @Patch(':id/declined')
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