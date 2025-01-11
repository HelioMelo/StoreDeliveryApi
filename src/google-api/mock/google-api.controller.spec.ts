import { Test, TestingModule } from '@nestjs/testing';
import { GoogleApiController } from '../google-api.controller';
import { GoogleApiService } from '../google-api.service';

describe('GoogleApiController', () => {
  let controller: GoogleApiController;
  let service: GoogleApiService;

  beforeEach(async () => {
    const mockGoogleApiService = {
      findPlaces: jest.fn().mockResolvedValue([
        {
          name: 'Place 1',
          address: 'Address 1',
        },
        {
          name: 'Place 2',
          address: 'Address 2',
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleApiController],
      providers: [
        {
          provide: GoogleApiService,
          useValue: mockGoogleApiService,
        },
      ],
    }).compile();

    controller = module.get<GoogleApiController>(GoogleApiController);
    service = module.get<GoogleApiService>(GoogleApiService);
  });

  it('should return places when valid text is passed', async () => {
    const text = 'test place';
    const result = await controller.findPlaces(text);

    expect(result).toEqual([
      { name: 'Place 1', address: 'Address 1' },
      { name: 'Place 2', address: 'Address 2' },
    ]);
    expect(service.findPlaces).toHaveBeenCalledWith(text);
  });

  it('should throw an error if no text is passed', async () => {
    const text = null;

    try {
      await controller.findPlaces(text);
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });
});
