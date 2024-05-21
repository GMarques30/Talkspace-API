import { UploadParams } from './../../src/domain/user/application/storage/uploader';
import { randomUUID } from 'crypto';
import { Uploader } from 'src/domain/user/application/storage/uploader';

export interface Uploads {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Uploads[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();

    await this.uploads.push({
      fileName,
      url,
    });

    return {
      url,
    };
  }
}
