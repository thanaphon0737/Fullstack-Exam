import { Controller, Post, Body, UseGuards, Request, Get, Patch,Query, Delete,Param, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.gard';
import { Response } from 'express';
import { FindAllOrdersDto } from './dto/find-all-order.dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // status service
  @Get('')
  getHello():string{
    return this.appService.getHello();
  }
  // --- Auth Endpoints ---
  @Post('auth/signUp')
  register(@Body() body: any) {
    return this.appService.register(body);
  }

  @Post('auth/signIn')
  async login(@Body() body: any, @Res({ passthrough: true }) response: Response) {
    const { access_token } = await this.appService.login(body);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false, // for dev
      path: '/',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    return { message: 'Login successful' };
  }

  @Post('auth/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logout successful' };
  }

  @Get('auth/profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req){
    
    const userId = req.user.userId;
    return this.appService.getProfile(userId);
  }

  // --- Orders Endpoints ---

  // create order
  @Post('orders')
  @Roles('customer', 'admin') // need rol order | admin
  @UseGuards(AuthGuard('jwt'), RolesGuard) // check jwt and roles
  createOrder(@Request() req, @Body() body: any) {
    // attach userId from token before send payload 
    const createOrderDto = {
      ...body,
      userId: req.user.userId,
    };
    return this.appService.createOrder(createOrderDto);
  }


  // get orders
  @Get('orders')
  @Roles('staff','admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  getOrder(){
    return this.appService.getOrders()
  }

  // update order
  @Patch('orders/:id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  updateOrder(@Param('id') orderId:string, @Body() body:any){
    const updateDto = {
      ...body
    };
    return this.appService.updateOrder(orderId,updateDto)
  }

  // delete order
  @Delete('orders/:id')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  deleteOrder(@Param('id') orderId:string, @Body() body:any){
    return this.appService.deleteOrder(orderId)
  }
}
