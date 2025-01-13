import { PinsEntity } from './../entities/pins.entity';

export interface ResponseStorePdv {
  storeName: string;
  nameProduct: string;
  city: string;
  postalCode: string;
  type: string;
  distance: string;
  value: ResponseValue[];
  pins: PinsEntity;
}

export interface ResponseValue {
  prazo: string;
  price: string;
  description: string;
  codProdutoAgencia?: string;
}
