export interface MessageQueuePublisher {
  publish(message: any): Promise<void>;
}
