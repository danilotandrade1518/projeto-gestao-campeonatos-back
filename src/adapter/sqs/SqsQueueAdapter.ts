import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { QueueAdapter } from '../../infrastructure/adapters/QueueAdapter';

export class SqsQueueAdapter implements QueueAdapter {
  private readonly client = new SQSClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });

  async sendMessage(message: string, queueUrl: string): Promise<void> {
    await this.client.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: message,
      }),
    );
  }
}
