import { readFile } from 'fs/promises';

export interface MetroConfig {
  metroJson: string;
}

export class SearchMetro {
  constructor(private readonly metroConfig: MetroConfig) {}

  private removeLastStationSuffix(name: string): string {
    return name.replace(/역$/, '');
  }

  async getMetroLatLng(
    name: string,
  ): Promise<{ lat: string; lng: string } | null> {
    // JSON 파일 읽기
    const rawData = await readFile(this.metroConfig.metroJson, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const jsonData = JSON.parse(rawData);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (const line of jsonData.DATA) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      for (const node of line.node) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const found = node.station.find(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (s) => s.name === this.removeLastStationSuffix(name),
        );
        if (found) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          return { lat: found.lat, lng: found.lng };
        }
      }
    }

    return null;
  }
}
