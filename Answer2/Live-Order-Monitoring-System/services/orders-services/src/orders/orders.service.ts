import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import Redis from 'ioredis';



@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @Inject('REDIS_CLIENT') private readonly redisClient:Redis,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    console.log(createOrderDto)
    const newOrder = this.ordersRepository.create(createOrderDto);
    await this.ordersRepository.save(newOrder);

    this.redisClient.publish('order_events', JSON.stringify(newOrder));
    console.log(`Publish new order event to Redis: ${newOrder.id}`);

    return newOrder;
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({id});
    if(!order){
      throw new NotFoundException(`Order with ID ${id} not found`)
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.preload({
      id:id,
      ...updateOrderDto,
    });
    if(!order){
      throw new NotFoundException(`Order with ID "${id}" not found`)
    }
    return this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);

  }
}
