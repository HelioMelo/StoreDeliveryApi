import { ReturnAddressDTO } from 'src/address/dto/returnAddress.dto';
import { ReturnPaymentDTO } from '../../payment/dtos/return-payment.dto';
import { OrderEntity } from '../entities/order.entity';
import { ReturnOrderProductDTO } from 'src/order-product/dto/return-order-product.dto';
import { ReturnUserDTO } from 'src/user/dtos/returnUser.dto';
export class ReturnOrderDTO {
  id: number;
  date: string;
  userId: number;
  addressId: number;
  paymentId: number;
  user?: ReturnUserDTO;
  address?: ReturnAddressDTO;
  payment?: ReturnPaymentDTO;
  ordersProduct?: ReturnOrderProductDTO[];
  amountProducts?: number;

  constructor(order?: OrderEntity) {
    this.id = order?.id;
    this.date = order?.date.toString();
    this.userId = order?.userId;
    this.addressId = order?.addressId;
    this.paymentId = order?.paymentId;
    this.user = order?.user ? new ReturnUserDTO(order?.user) : undefined;
    this.address = order?.address
      ? new ReturnAddressDTO(order?.address)
      : undefined;
    this.payment = order?.payment
      ? new ReturnPaymentDTO(order?.payment)
      : undefined;
    this.ordersProduct = order?.ordersProduct
      ? order?.ordersProduct.map(
          (orderProduct) => new ReturnOrderProductDTO(orderProduct),
        )
      : undefined;
    this.amountProducts = order?.amountProducts;
  }
}
