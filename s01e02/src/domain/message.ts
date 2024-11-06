import type { ModelResponse } from 'types';

export class Message {
  constructor(public readonly text: string, public readonly msgID: number) {}

  static create(text: string, msgID: number): Message {
    return new Message(text, msgID);
  }

  static fromResponse(response: ModelResponse): Message {
    return new Message(response.text, response.msgID);
  }

  isFlagMessage(): boolean {
    return this.text.startsWith('{{FLG:');
  }

  isProcessingError(): boolean {
    return this.msgID === 0;
  }

  toJSON() {
    return {
      text: this.text,
      msgID: this.msgID,
    };
  }
}
