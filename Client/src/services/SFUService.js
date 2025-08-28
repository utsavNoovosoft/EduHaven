import * as mediasoupClient from 'mediasoup-client';

class SFUService {
  constructor() {
    this.device = null;
    this.socket = null;
    this.sendTransport = null;
    this.recvTransport = null;
    this.producers = new Map();
    this.consumers = new Map();
    this.isDeviceLoaded = false;
  }

  async initialize(socket) {
    this.socket = socket;
    
    // Get router RTP capabilities
    const routerRtpCapabilities = await new Promise((resolve) => {
      socket.emit('getRouterRtpCapabilities', resolve);
    });

    if (routerRtpCapabilities.error) {
      throw new Error(routerRtpCapabilities.error);
    }

    // Create device
    this.device = new mediasoupClient.Device();
    
    // Load device with router RTP capabilities
    await this.device.load({ routerRtpCapabilities });
    this.isDeviceLoaded = true;
    
    console.log('SFU Service initialized successfully');
  }

  async createSendTransport() {
    const transportInfo = await new Promise((resolve) => {
      this.socket.emit('createWebRtcTransport', { forceTcp: false, consuming: false }, resolve);
    });

    if (transportInfo.error) {
      throw new Error(transportInfo.error);
    }

    this.sendTransport = this.device.createSendTransport(transportInfo);

    this.sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        const result = await new Promise((resolve) => {
          this.socket.emit('connectTransport', {
            transportId: this.sendTransport.id,
            dtlsParameters
          }, resolve);
        });

        if (result.error) {
          errback(new Error(result.error));
        } else {
          callback();
        }
      } catch (error) {
        errback(error);
      }
    });

    this.sendTransport.on('produce', async (parameters, callback, errback) => {
      try {
        const result = await new Promise((resolve) => {
          this.socket.emit('produce', {
            transportId: this.sendTransport.id,
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData
          }, resolve);
        });

        if (result.error) {
          errback(new Error(result.error));
        } else {
          callback({ id: result.id });
        }
      } catch (error) {
        errback(error);
      }
    });

    return this.sendTransport;
  }

  async createRecvTransport() {
    const transportInfo = await new Promise((resolve) => {
      this.socket.emit('createWebRtcTransport', { forceTcp: false, consuming: true }, resolve);
    });

    if (transportInfo.error) {
      throw new Error(transportInfo.error);
    }

    this.recvTransport = this.device.createRecvTransport(transportInfo);

    this.recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        const result = await new Promise((resolve) => {
          this.socket.emit('connectTransport', {
            transportId: this.recvTransport.id,
            dtlsParameters
          }, resolve);
        });

        if (result.error) {
          errback(new Error(result.error));
        } else {
          callback();
        }
      } catch (error) {
        errback(error);
      }
    });

    return this.recvTransport;
  }

  async produce(track, kind) {
    if (!this.sendTransport) {
      await this.createSendTransport();
    }

    const producer = await this.sendTransport.produce({
      track,
      kind,
      codecOptions: {
        videoGoogleStartBitrate: 1000
      }
    });

    this.producers.set(producer.id, producer);
    
    producer.on('trackended', () => {
      console.log('Producer track ended');
      this.closeProducer(producer.id);
    });

    producer.on('transportclose', () => {
      console.log('Producer transport closed');
      this.closeProducer(producer.id);
    });

    return producer;
  }

  async consume(consumerInfo) {
    if (!this.recvTransport) {
      await this.createRecvTransport();
    }

    const consumer = await this.recvTransport.consume({
      id: consumerInfo.id,
      producerId: consumerInfo.producerId,
      kind: consumerInfo.kind,
      rtpParameters: consumerInfo.rtpParameters
    });

    this.consumers.set(consumer.id, consumer);

    consumer.on('transportclose', () => {
      console.log('Consumer transport closed');
      this.consumers.delete(consumer.id);
    });

    return consumer;
  }

  closeProducer(producerId) {
    const producer = this.producers.get(producerId);
    if (producer) {
      producer.close();
      this.producers.delete(producerId);
    }
  }

  closeConsumer(consumerId) {
    const consumer = this.consumers.get(consumerId);
    if (consumer) {
      consumer.close();
      this.consumers.delete(consumerId);
    }
  }

  close() {
    // Close all producers
    this.producers.forEach((producer) => {
      producer.close();
    });
    this.producers.clear();

    // Close all consumers  
    this.consumers.forEach((consumer) => {
      consumer.close();
    });
    this.consumers.clear();

    // Close transports
    if (this.sendTransport) {
      this.sendTransport.close();
      this.sendTransport = null;
    }

    if (this.recvTransport) {
      this.recvTransport.close();
      this.recvTransport = null;
    }

    this.device = null;
    this.socket = null;
    this.isDeviceLoaded = false;
  }
}

export default SFUService;
