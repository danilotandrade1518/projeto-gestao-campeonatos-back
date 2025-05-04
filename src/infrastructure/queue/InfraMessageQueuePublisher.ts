import { MessageQueuePublisher } from '../../application/protocols/MessageQueuePublisher';
import { QueueAdapter } from '../../infrastructure/adapters/QueueAdapter';

export class InfraMessageQueuePublisher implements MessageQueuePublisher {
  constructor(
    private readonly adapter: QueueAdapter,
    private readonly queueUrl: string,
  ) {}

  async publish(message: any): Promise<void> {
    const json = JSON.stringify(message);
    await this.adapter.sendMessage(json, this.queueUrl);
  }
}
