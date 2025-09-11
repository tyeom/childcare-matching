import { HttpService } from '@nestjs/axios';
import { LocalSearchAddress } from '@app/common/external-apis/local-search-address';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const LOCAL_SEARCH_ADDRESS_TOKEN = 'LOCAL_SEARCH_ADDRESS';

export const localSearchAddressProvider: Provider = {
  provide: LOCAL_SEARCH_ADDRESS_TOKEN,
  useFactory: (configService: ConfigService, httpService: HttpService) => {
    return new LocalSearchAddress(
      {
        apiUrl: configService.get<string>(
          'KAKAO_API_URL',
          'https://dapi.kakao.com/',
        ),
        accessKey: configService.get<string>('KAKAO_API', ''),
      },
      httpService,
    );
  },
  inject: [ConfigService, HttpService],
};
