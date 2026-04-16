import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface VideoItem {
  id: string;
  thumbnail: string;
  title: string;
  author: string;
  publishedAt: string;
  hypeLevel: number;
  isCrown: boolean;
}

@Injectable()
export class VideosService {
  private getRelativeTime(dateStr: string): string {
    const now = new Date();
    const published = new Date(dateStr);
    const diffMs = now.getTime() - published.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 30) return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`;
    if (diffMonths < 12) return `Hace ${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
    return `Hace ${diffYears} año${diffYears !== 1 ? 's' : ''}`;
  }

  private calculateHype(item: any): number {
    const stats = item.statistics ?? {};

    if (!('commentCount' in stats)) return 0;

    const views = parseInt(stats.viewCount ?? '0', 10);
    const likes = parseInt(stats.likeCount ?? '0', 10);
    const comments = parseInt(stats.commentCount ?? '0', 10);

    if (views === 0) return 0;

    let hype = (likes + comments) / views;

    if (/tutorial/i.test(item.snippet?.title ?? '')) {
      hype *= 2;
    }

    return Math.round(hype * 10000) / 10000;
  }

  getVideos(): VideoItem[] {
    const filePath = path.join(__dirname, '..', 'mock-youtube-api.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    const videos: VideoItem[] = data.items.map((item: any) => ({
      id: item.id,
      thumbnail: item.snippet?.thumbnails?.high?.url ?? '',
      title: item.snippet?.title ?? '',
      author: item.snippet?.channelTitle ?? '',
      publishedAt: this.getRelativeTime(item.snippet?.publishedAt),
      hypeLevel: this.calculateHype(item),
      isCrown: false,
    }));

    const maxHype = Math.max(...videos.map((v) => v.hypeLevel));
    if (maxHype > 0) {
      const crownIndex = videos.findIndex((v) => v.hypeLevel === maxHype);
      videos[crownIndex].isCrown = true;
    }

    videos.sort((a, b) => {
      if (a.isCrown) return -1;
      if (b.isCrown) return 1;
      return b.hypeLevel - a.hypeLevel;
    });

    return videos;
  }
}
