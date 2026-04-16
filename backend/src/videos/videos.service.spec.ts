import { VideosService } from './videos.service';

describe('VideosService', () => {
  let service: VideosService;

  beforeEach(() => {
    service = new VideosService();
  });

  describe('getVideos', () => {
    it('debe retornar un array de videos', () => {
      const result = service.getVideos();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('cada video debe tener las propiedades esperadas', () => {
      const result = service.getVideos();
      const video = result[0];

      expect(video).toHaveProperty('id');
      expect(video).toHaveProperty('thumbnail');
      expect(video).toHaveProperty('title');
      expect(video).toHaveProperty('author');
      expect(video).toHaveProperty('publishedAt');
      expect(video).toHaveProperty('hypeLevel');
      expect(video).toHaveProperty('isCrown');
    });

    it('solo un video debe tener isCrown en true', () => {
      const result = service.getVideos();
      const crowns = result.filter((v) => v.isCrown);
      expect(crowns).toHaveLength(1);
    });

    it('el primer video debe ser el crown', () => {
      const result = service.getVideos();
      expect(result[0].isCrown).toBe(true);
    });

    it('los videos deben estar ordenados por hypeLevel descendente', () => {
      const result = service.getVideos();
      for (let i = 1; i < result.length - 1; i++) {
        expect(result[i].hypeLevel).toBeGreaterThanOrEqual(result[i + 1].hypeLevel);
      }
    });

    it('videos sin commentCount deben tener hype 0', () => {
      const result = service.getVideos();
      const vid012 = result.find((v) => v.id === 'vid_012');
      expect(vid012.hypeLevel).toBe(0);
    });

    it('videos con 0 views deben tener hype 0', () => {
      const result = service.getVideos();
      const vid007 = result.find((v) => v.id === 'vid_007');
      expect(vid007.hypeLevel).toBe(0);
    });

    it('publishedAt debe ser un string relativo', () => {
      const result = service.getVideos();
      result.forEach((v) => {
        expect(v.publishedAt).toMatch(/^Hace /);
      });
    });
  });
});
