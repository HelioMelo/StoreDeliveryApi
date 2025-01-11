export interface ResponseStorePdv {
  storeName: string;
  nameProduct: string;
  city: string;
  postalCode: string;
  type: string;
  distance: string;
  value: ResponseValue[];
}

export interface ResponseValue {
  prazo: string;
  price: string;
  description: string;
  codProdutoAgencia?: string;
}
