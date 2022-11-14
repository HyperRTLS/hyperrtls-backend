import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';

import { AnchorsService } from './anchors.service';

@Controller('devices/anchors')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
export class AnchorsRestController {
  constructor(private readonly anchorsService: AnchorsService) {}
}
