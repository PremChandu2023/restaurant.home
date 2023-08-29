import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { OrderServices } from "./order-service";
import { MenuDto, MenuItemDto,  updatePaymentDTo } from "./orders.dtos";
import { MenuItems } from "./orders.entities/menuitem.entity";
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

@ApiTags("Orders")
@ApiBearerAuth()
@Controller('/order')
@UseInterceptors(RecentsearchInterceptor)
// @UseGuards(EmployeeAuthGuard,RolesGuard)
export class OrderController {
    constructor(private orderService: OrderServices) { }


    @Roles(Role.Manager,Role.Waiter)
    @OrderCustomdecator('Post', '/')
    @Post('/')
    createOrder(@Body() createOrder: createOrderDTo) {
        if( typeof(createOrder.tableNumber) === "string")
        {
            throw new BadRequestException({message : 'Table number should be number'})
        }
        return this.orderService.createOrder(createOrder);
    }

    @Get()
    @OrderCustomdecator('Get','')
   async  getAllOrders()
    {
       return await this.orderService.getAllOrders();
    }

    @Roles(Role.Manager,Role.Waiter)
    @OrderCustomdecator('Get','/:id')
    @Get('/:id')
    getOrderDetailsById(@Param('id', ParseIntPipe) OrderId: number) {
        return this.orderService.getOrderById(OrderId)
    }

    // @Roles(Role.Manager,Role.Waiter)
    // @OrderCustomdecator('Get','/byname/:name')
    // @Get('/byname/:name')
    // async getOrderDetailsByName(@Param('name') customerName: string) {
    //     return await this.orderService.getOrderByName(customerName)
    // }

    @Roles(Role.Manager,Role.Waiter)
    @OrderCustomdecator('Put','/itemquantity:id')
    @Put('/itemquantity:id')
    async updateOrderQuantity(@Param('id') customerName:string, @Body() updateOrder: updateOrderDto) {

        return await this.orderService.updateOrderQuantity(updateOrder, customerName);

    }
    /* Delets the menuItem of the Given customer order
    * @OrderItem => it is the combined id  of orderid and particular menitem id  */
    @Roles(Role.Manager,Role.Waiter)
    @Delete(':orderItemId')
    @OrderCustomdecator('Delete',':orderItemId')
    deleteMenuItem(@Param('menuItemid', ParseIntPipe) orderItemId:number) {
       return  this.orderService.deleteMenuItem(orderItemId);
    }

    @Delete(':Orderid')
    @OrderCustomdecator('Delete',':Orderid')
    async deleteOrder(@Param('id',ParseIntPipe) orderId:number)
    {
        return await this.orderService.deleteOrderById(orderId);
    }
    
    @OrderCustomdecator('Put','/:id/addItem')
    @Put('/:id/addItem')
    addMenuItem(@Param('id', ParseIntPipe) id:number,@Body() updateMenuItem:updateOrderDto)
    {
        return this.orderService.addMenuItem(updateMenuItem,id);
    }

    //approve the payment request
    @Patch('approved/:id')
    @OrderCustomdecator('Patch','approved/:id')
    updatePaymentStatus( @Param('id') id :number)
    {
       const  updateStatus:updatePaymentDTo = {
        orderStatus:PaymentStatus.APPROVED
       }
        return this.orderService.updatePaymentandOrderStatus(updateStatus,id );
    }

    //cancle the payment request
    @Patch('declined/:id')
    @OrderCustomdecator('Patch','declined/:id')
    updatePaymentdeStatus( @Param('id') id :number)
    {
       const  updateStatus:updatePaymentDTo = {
        orderStatus:PaymentStatus.DECLINED
       }
        return this.orderService.updatePaymentandOrderStatus(updateStatus,id );
    }
}