import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { ReturnStore } from './dtos/return-store.dto';
import { CreateStore } from './dtos/create-store.dto';
import { StoreEntity } from './entities/store.entity';
import { PagedSearchRequest } from './dtos/paged-search-request';
import { PagedSearchResult } from './dtos/paged-search-result';

@ApiTags('Store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('all')
  @ApiOperation({ summary: 'Retrieve all stores' })
  @ApiResponse({
    status: 200,
    description: 'List of all stores',
    type: [ReturnStore],
  })
  async findAllCategories(): Promise<ReturnStore[]> {
    return this.storeService.findAllStores();
  }

  @Post('all/paginated')
  @ApiOperation({ summary: 'Retrieve stores with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of stores',
  })
  async findAllStoresPaginated(
    @Body() pagedSearchRequest: PagedSearchRequest,
  ): Promise<PagedSearchResult> {
    return this.storeService.findAllStoresPaginated(pagedSearchRequest);
  }

  @Get('storeById/:storeId')
  @ApiOperation({ summary: 'Retrieve a store by its ID' })
  @ApiResponse({
    status: 200,
    description: 'Store details by ID',
    type: ReturnStore,
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  async findStoreById(@Param('storeId') storeId: number): Promise<ReturnStore> {
    return this.storeService.findStoreById(storeId);
  }

  @Get('storeByCep/:cep/:pageIndex/:pageSize')
  @ApiOperation({ summary: 'Retrieve nearby stores by CEP' })
  @ApiResponse({
    status: 200,
    description: 'List of nearby stores',
    type: [ReturnStore],
  })
  @ApiResponse({ status: 400, description: 'CEP is required' })
  async findNearbyStoresByCep(
    @Param('cep') cep: string,
    @Param('pageIndex') pageIndex: number,
    @Param('pageSize') pageSize: number,
  ): Promise<any> {
    return this.storeService.findNearbyStoresByCep(cep, pageIndex, pageSize);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new store' })
  @ApiResponse({
    status: 201,
    description: 'Store successfully created',
    type: StoreEntity,
  })
  async createStore(@Body() createStore: CreateStore): Promise<StoreEntity> {
    return this.storeService.createStore(createStore);
  }

  @Get('storeByState/:state')
  @ApiOperation({ summary: 'Retrieve stores by state' })
  @ApiResponse({
    status: 200,
    description: 'List of stores in the specified state',
    type: [ReturnStore],
  })
  @ApiResponse({
    status: 404,
    description: 'No stores found for the specified state',
  })
  async findStoresByState(
    @Param('state') state: string,
  ): Promise<ReturnStore[]> {
    const stores = await this.storeService.findStoresByState(state);
    return stores.map((store) => new ReturnStore(store));
  }
}
