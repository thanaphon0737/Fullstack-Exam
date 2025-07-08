import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { FindAllOrdersDto } from './dto/find-all-order.dto';
@Injectable()
export class AppService {
  private readonly usersServiceUrl: string;
  private readonly ordersServiceUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const usersServiceUrl = this.configService.get<string>('USERS_SERVICE_URL');
    if (!usersServiceUrl) {
      throw new Error('USERS_SERVICE_URL is not defined in environment variables');
    }
    this.usersServiceUrl = usersServiceUrl;

    const ordersServiceUrl = this.configService.get<string>('ORDERS_SERVICE_URL');
    if (!ordersServiceUrl) {
      throw new Error('ORDERS_SERVICE_URL is not defined in environment variables');
    }
    this.ordersServiceUrl = ordersServiceUrl;
  }

  // --- User-related methods ---
  register(body: any) {
    return lastValueFrom(
      this.httpService.post(`${this.usersServiceUrl}/users/signUp`, body),
    ).then(res => res.data);
  }

  login(body: any) {
    return lastValueFrom(
      this.httpService.post(`${this.usersServiceUrl}/users/signIn`, body),
    ).then(res => res.data);
  }

  getProfile(userId:string){
    return lastValueFrom(
      this.httpService.get(`${this.usersServiceUrl}/users/${userId}`),

    ).then(res =>res.data);
  }

  // --- Order-related methods ---
  createOrder(body: any) {
    return lastValueFrom(
      this.httpService.post(`${this.ordersServiceUrl}/orders`, body),
    ).then(res => res.data);
  }
  getOrders(){
    return lastValueFrom(
      this.httpService.get(`${this.ordersServiceUrl}/orders`),
    ).then(res => res.data);
  }
  updateOrder(id:string,body: any){
    return lastValueFrom(
      this.httpService.patch(`${this.ordersServiceUrl}/orders/${id}`, body),
    ).then(res => res.data);
  }

  deleteOrder(id:string){
    return lastValueFrom(
      this.httpService.delete(`${this.ordersServiceUrl}/orders/${id}`),
    ).then(res => res.data);
  }
  getHello(): string {
    return 'Gate way is healthy!';
  }
  

}
