export interface QueueAdapter {
  sendMessage(message: string, queueUrl: string): Promise<void>;
}
