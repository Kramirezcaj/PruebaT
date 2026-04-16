import { Controller, Get } from '@nestjs/common';
import { VideosService } from './videos.service';

@Controller('api/videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  getVideos() {
    return this.videosService.getVideos();
  }
}
