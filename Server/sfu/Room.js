export class Room {
  constructor(roomId, router) {
    this.id = roomId;
    this.router = router;
    this.peers = new Map();
    console.log(`Room ${roomId} created`);
  }

  addPeer(peerId, socket) {
    const peer = {
      id: peerId,
      socket: socket,
      transports: new Map(),
      producers: new Map(),
      consumers: new Map(),
    };
    
    this.peers.set(peerId, peer);
    console.log(`Peer ${peerId} added to room ${this.id}`);
    
    // Notify other peers about new peer
    this.broadcast(peerId, 'newPeer', { peerId });
    
    return peer;
  }

  removePeer(peerId) {
    const peer = this.peers.get(peerId);
    if (!peer) return;

    // Close all transports
    peer.transports.forEach(transport => transport.close());
    
    // Close all producers
    peer.producers.forEach(producer => producer.close());
    
    // Close all consumers
    peer.consumers.forEach(consumer => consumer.close());
    
    this.peers.delete(peerId);
    
    // Notify other peers
    this.broadcast(peerId, 'peerLeft', { peerId });
    
    console.log(`Peer ${peerId} removed from room ${this.id}`);
  }

  getPeer(peerId) {
    return this.peers.get(peerId);
  }

  getPeers() {
    return Array.from(this.peers.keys());
  }

  broadcast(excludePeerId, event, data) {
    this.peers.forEach((peer, peerId) => {
      if (peerId !== excludePeerId && peer.socket) {
        peer.socket.emit(event, data);
      }
    });
  }

  async createWebRtcTransport(peerId) {
    const peer = this.getPeer(peerId);
    if (!peer) throw new Error(`Peer ${peerId} not found`);

    const transport = await this.router.createWebRtcTransport({
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1',
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    transport.on('dtlsstatechange', (dtlsState) => {
      if (dtlsState === 'closed') {
        transport.close();
      }
    });

    peer.transports.set(transport.id, transport);
    
    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
    };
  }

  async connectTransport(peerId, transportId, dtlsParameters) {
    const peer = this.getPeer(peerId);
    if (!peer) throw new Error(`Peer ${peerId} not found`);

    const transport = peer.transports.get(transportId);
    if (!transport) throw new Error(`Transport ${transportId} not found`);

    await transport.connect({ dtlsParameters });
  }

  async produce(peerId, transportId, kind, rtpParameters, appData) {
    const peer = this.getPeer(peerId);
    if (!peer) throw new Error(`Peer ${peerId} not found`);

    const transport = peer.transports.get(transportId);
    if (!transport) throw new Error(`Transport ${transportId} not found`);

    const producer = await transport.produce({
      kind,
      rtpParameters,
      appData,
    });

    peer.producers.set(producer.id, producer);

    // Create consumers for other peers
    this.peers.forEach(async (otherPeer, otherPeerId) => {
      if (otherPeerId !== peerId) {
        await this.createConsumer(otherPeerId, producer.id, peerId);
      }
    });

    return producer.id;
  }

  async createConsumer(consumerPeerId, producerId, producerPeerId) {
    const consumerPeer = this.getPeer(consumerPeerId);
    const producerPeer = this.getPeer(producerPeerId);
    
    if (!consumerPeer || !producerPeer) return;

    const producer = producerPeer.producers.get(producerId);
    if (!producer) return;

    // Find a receiving transport for the consumer
    const transport = Array.from(consumerPeer.transports.values())
      .find(t => t.appData?.consuming);

    if (!transport) return;

    try {
      const consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities: this.router.rtpCapabilities,
        paused: false,
      });

      consumerPeer.consumers.set(consumer.id, consumer);

      // Notify consumer peer about new consumer
      consumerPeer.socket.emit('newConsumer', {
        peerId: producerPeerId,
        producerId: producer.id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused,
      });

      return consumer;
    } catch (error) {
      console.error('Error creating consumer:', error);
      return null;
    }
  }
}
