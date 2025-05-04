import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { QueueAdapter } from '../../infrastructure/adapters/QueueAdapter';

export class SqsQueueAdapter implements QueueAdapter {
  private readonly client = new SQSClient({
    region: process.env.AWS_REGION || 'us-east-1',
  });

  async sendMessage(message: string, queueUrl: string): Promise<void> {
    try {
      await this.client.send(
        new SendMessageCommand({
          QueueUrl: queueUrl,
          MessageBody: message,
        }),
      );
    } catch (error) {
      console.log('Sending message to SQS:', message, queueUrl);

      throw new Error(
        `Error sending message to SQS: ${error}. Message: ${message} ||| Queue URL: ${queueUrl}`,
      );
    }
  }
}
