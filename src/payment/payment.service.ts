import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from '../cart-product/entities/cart-product.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { PaymentType } from '../payment-status/enums/payment-type.enum';
import { ProductEntity } from '../product/entities/product.entity';
import { Repository } from 'typeorm';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';

import { PaymentEntity } from './entities/payment.entity';
import { CreateOrderDTO } from 'src/order/dto/create-order.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  generateFinalPrice(cart: CartEntity, products: ProductEntity[]): number {
    if (!cart.cartProduct || cart.cartProduct.length === 0) {
      return 0;
    }

    return Number(
      cart.cartProduct
        .map((cartProduct: CartProductEntity) => {
          const product = products.find(
            (product) => product.id === cartProduct.productId,
          );
          if (product) {
            return cartProduct.amount * product.price;
          }

          return 0;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        .toFixed(2),
    );
  }

  async createPayment(
    createOrderDTO: CreateOrderDTO,
    // products: ProductEntity[],
    // cart: CartEntity,
  ): Promise<PaymentEntity> {
    // const finalPrice = this.generateFinalPrice(cart, products);

    if (createOrderDTO.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        0,
        0,
        0,
        createOrderDTO,
      );
      return this.paymentRepository.save(paymentCreditCard);
    }

    throw new BadRequestException(
      'Amount Payments or code pix or date payment not found',
    );
  }
}
