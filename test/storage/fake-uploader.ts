import {
  UploadParams,
  Uploader,
} from '@/domain/marketplace/application/storage/uploader'
import { randomUUID } from 'crypto'

interface Upload {
  fileName: string
  path: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ path: string }> {
    const path = randomUUID()

    this.uploads.push({
      fileName,
      path,
    })

    return { path }
  }
}
