export class VideoShow {
  options: Object;
  items: Object[];

  constructor(size, items) {
    this.options = {
      fps: 25,
      transition: true,
      transitionDuration: 0.5, // seconds
      useSubRipSubtitles: false,
      videoBitrate: 1024,
      videoCodec: 'libx264',
      size: size,
      audioBitrate: '128k',
      audioChannels: 2,
      format: 'mp4',
      pixelFormat: 'yuv420p',
    };
    this.items = items;
  }
}
