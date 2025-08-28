import mediasoup from 'mediasoup';
import { config } from './config.js';

let worker;
let router;

const mediaCodecs = [
  {
    kind: 'audio',
    mimeType: 'audio/opus',
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: 'video',
    mimeType: 'video/VP8',
    clockRate: 90000,
    parameters: {
      'x-google-start-bitrate': 1000,
    },
  },
  {
    kind: 'video',
    mimeType: 'video/H264',
    clockRate: 90000,
    parameters: {
      'packetization-mode': 1,
      'profile-level-id': '42e01f',
      'level-asymmetry-allowed': 1,
    },
  },
];

export const initializeMediasoup = async () => {
  try {
    // Create worker
    worker = await mediasoup.createWorker({
      logLevel: config.mediasoup.worker.logLevel,
      rtcMinPort: config.mediasoup.worker.rtcMinPort,
      rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
    });

    worker.on('died', () => {
      console.error('mediasoup worker died, exiting in 2 seconds...');
      setTimeout(() => process.exit(1), 2000);
    });

    // Create router
    router = await worker.createRouter({ mediaCodecs });

    console.log('Mediasoup worker and router created successfully');
    return router;
  } catch (error) {
    console.error('Failed to initialize mediasoup:', error);
    throw error;
  }
};

export const getRouter = () => router;
export const getWorker = () => worker;
