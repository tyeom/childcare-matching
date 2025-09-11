import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface ApiConfig {
  apiUrl: string;
  accessKey: string;
}

export class LocalSearchAddress {
  private readonly endpoint = 'v2/local/search/address.json';

  constructor(
    private readonly apiConfig: ApiConfig,
    private readonly httpService: HttpService,
  ) {}

  async getAddressInfo(address: string): Promise<any> {
    const apiUrl = `${this.apiConfig.apiUrl}${this.endpoint}?analyze_type=similar&query=${encodeURIComponent(address)}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await firstValueFrom(
      this.httpService.get(apiUrl, {
        headers: {
          Authorization: `KakaoAK ${this.apiConfig.accessKey}`,
        },
      }),
    );

    return data;
  }

  extractLatLon(data: any): { lat: string; lon: string } | null {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (data?.documents?.length > 0 && data.documents[0].address) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        lat: data.documents[0].address.y,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        lon: data.documents[0].address.x,
      };
    }
    return null;
  }
}
