import { Module } from '@nestjs/common'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'

@Module({
  imports: [],
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResouceModule {}
