import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindAllOrdersDto } from './dto/find-all-order.dto';
import { Order } from './entities/order.entity';
import Redis from 'ioredis';
import { stat } from 'fs';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    console.log(createOrderDto);
    const newOrder = this.ordersRepository.create(createOrderDto);
    await this.ordersRepository.save(newOrder);
    const event = { type: 'CREATE', data: newOrder };
    this.redisClient.publish('order_events', JSON.stringify(event));
    console.log(`Publish new order event to Redis: ${newOrder.id}`);

    return newOrder;
  }

  findAll(query: FindAllOrdersDto): Promise<Order[]> {
    const {status} = query;

    return this.ordersRepository.find({
      where: status ? {status} : {}
    })
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // preload for merge old and new data

    // if( order.status === 'completed' || order.status === 'cancelled'){
    //   throw new BadRequestException(`Cannot update order that is already ${order.status}.`)
    // }
    const orderToUpdate = await this.ordersRepository.preload({
      id: id,
      ...updateOrderDto,
    });
    if (!orderToUpdate) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }

    const updatedOrder = await this.ordersRepository.save(orderToUpdate);

    // creat event to update
    const event = { type: 'UPDATE', data: updatedOrder };
    this.redisClient.publish('order_events', JSON.stringify(event));
    console.log(
      `Published UPDATE event to Redis for order: ${updatedOrder.id}`,
    );

    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id); 
    await this.ordersRepository.remove(order);

    // just send id for frontend
    const event = { type: 'DELETE', data: { id } };
    this.redisClient.publish('order_events', JSON.stringify(event));
    console.log(`Published DELETE event to Redis for order: ${id}`);
  }
}
