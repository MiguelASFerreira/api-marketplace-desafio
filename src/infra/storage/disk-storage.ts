import {
  Uploader,
  UploadParams,
} from '@/domain/marketplace/application/storage/uploader'

import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

@Injectable()
export class DiskStorage implements Uploader {
  private uploadDir = ''

  constructor(private envService: EnvService) {
    this.uploadDir = envService.get('UPLOAD_DIR')
  }

  async upload(params: UploadParams[]): Promise<{ paths: string[] }> {
    const paths = await Promise.all(
      params.map(async (file) => {
        const uploadId = randomUUID()
        const uniqueFileName = `${uploadId}-${file.fileName}`
        const filePath = join(this.uploadDir, uniqueFileName)

        await fs.writeFile(filePath, file.body)

        return uniqueFileName
      }),
    )

    return { paths }
  }
}
