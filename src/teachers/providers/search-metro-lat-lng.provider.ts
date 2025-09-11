import { SearchMetro } from '@app/common/utils/metro-lat-lng.util';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export const METRO_LAT_LNG_TOKEN = 'METRO_LAT_LNG';

export const SearchMetroLatLngProvider: Provider = {
  provide: METRO_LAT_LNG_TOKEN,
  useFactory: (configService: ConfigService) => {
    return new SearchMetro({
      metroJson: join(process.cwd(), 'public', 'data-metro-line-1.0.0.json'),
    });
  },
  inject: [ConfigService],
};
