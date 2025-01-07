import { ReturnCepExtDTO } from './return-cep-ext.dto';

export class ReturnCepDTO {
  zipCode: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  ddd: string;
  error?: string;

  constructor(returnCep: ReturnCepExtDTO) {
    this.zipCode = returnCep.cep;
    this.street = returnCep.logradouro;
    this.complement = returnCep.complemento;
    this.neighborhood = returnCep.bairro;
    this.city = returnCep.localidade;
    this.state = returnCep.uf;
    this.ddd = returnCep.ddd;
  }
}
