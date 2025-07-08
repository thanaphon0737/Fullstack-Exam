import { Controller, Post, Body, UseGuards, Request, Get, Patch,Query, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.gard';

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
  login(@Body() body: any) {
    return this.appService.login(body);
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
  getOrder(@Query() query:string){
    return this.appService.getOrders(query)
  }

  // update order
  @Patch('orders')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  updateOrder(@Request() req, @Body() body:any){
    const userId = req.user.userId
    const updateDto = {
      ...body,
      userId: req.user.userId,
    };
    return this.appService.updateOrder(userId,updateDto)
  }

  // delete order
  @Delete('orders')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  deleteOrder(@Request() req){
    const userId = req.user.userId
    return this.appService.deleteOrder(userId)
  }
}
