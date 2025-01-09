import { GoogleApiService } from './../google-api/google-api.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateAddressDTO } from './dto/createAddress.dto';
import { AddressEntity } from './entities/address.entity';
import { UserService } from './../user/user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly googleApiService: GoogleApiService,
  ) {}

  async createAddress(
    createAddressDTO: CreateAddressDTO,
    userId: number,
  ): Promise<AddressEntity> {
    // Verificando se o usuário existe
    await this.userService.findUserById(userId);

    // Verificando se o endereço contém as informações necessárias
    if (createAddressDTO.city && createAddressDTO.state) {
      // Concatenando cidade e estado para buscar as coordenadas
      const addressText = `${createAddressDTO.city}, ${createAddressDTO.state}, ${createAddressDTO.numberAddress}`;

      // Chamando a API para buscar as coordenadas (latitude e longitude)
      const googleResponse =
        await this.googleApiService.findPlaces(addressText);

      // Se não encontrar nenhuma coordenada, lançamos uma exceção
      if (googleResponse.length === 0) {
        throw new BadRequestException('Invalid address provided');
      }

      // Pegando as coordenadas do primeiro candidato retornado pela API
      const { lat, lng } = googleResponse[0].geometry.location;

      // Atribuindo as coordenadas ao DTO do endereço
      createAddressDTO.latitude = lat.toString();
      createAddressDTO.longitude = lng.toString();
    }

    // Salvando o endereço com as coordenadas e dados do usuário
    return this.addressRepository.save({
      ...createAddressDTO,
      userId,
    });
  }

  async storeCreateAddress(
    createAddressDTO: CreateAddressDTO,
    storeId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(storeId);
    return this.addressRepository.save({
      ...createAddressDTO,
      storeId,
    });
  }
  async findAddressByUserId(userId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: {
        userId,
      },
    });

    if (!addresses || addresses.length === 0) {
      throw new NotFoundException(`Address not found for userId: ${userId}`);
    }

    return addresses;
  }

  async findAddressByStoreId(storeId: number): Promise<AddressEntity[]> {
    const addresses = await this.addressRepository.find({
      where: {
        storeId,
      },
    });

    if (!addresses || addresses.length === 0) {
      throw new NotFoundException(`Address not found for storId: ${storeId}`);
    }

    return addresses;
  }

  async findCityByName(
    nameCity: string,
    nameState: string,
  ): Promise<AddressEntity> {
    const address = await this.addressRepository.findOne({
      where: {
        city: ILike(nameCity),
        state: ILike(nameState),
      },
    });

    if (!address) {
      throw new NotFoundException(
        `Address not found for city "${nameCity}" and state "${nameState}"`,
      );
    }

    return address;
  }

  async processAddress(
    createAddressDto: CreateAddressDTO,
  ): Promise<AddressEntity> {
    // Mapeando o DTO para a entidade AddressEntity
    const address = new AddressEntity();
    address.logradouro = createAddressDto.logradouro;
    address.city = createAddressDto.city;
    address.state = createAddressDto.state;
    address.numberAddress = createAddressDto.numberAddress;

    // Concatenando cidade e estado para realizar a busca
    const addressText =
      address.logradouro +
      ', ' +
      address.city +
      ', ' +
      address.state +
      ', ' +
      address.numberAddress;

    // Fazendo a consulta ao Google API para encontrar o local
    const googleResponse = await this.googleApiService.findPlaces(addressText);

    if (googleResponse.length === 0) {
      throw new BadRequestException(
        `Invalid address for ${address.city}, ${address.state}`,
      );
    }

    // Pegando as coordenadas do primeiro candidato retornado pela API
    const { lat, lng } = googleResponse[0].geometry.location;

    // Atribuindo as coordenadas ao endereço
    address.latitude = lat.toString();
    address.longitude = lng.toString();
    address.pin = `https://maps.google.com/mapfiles/ms/icons/red-dot.png`;

    // Se o campo 'cep' não foi fornecido, podemos atribuir um valor padrão
    if (!createAddressDto.cep) {
      address.cep = ''; // Ou algum valor padrão, se necessário
    } else {
      address.cep = createAddressDto.cep;
    }

    return address; // Retorna a entidade com as coordenadas
  }
}
