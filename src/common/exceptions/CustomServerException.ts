export class CustomServerException extends Error {
  constructor(message: string) {
    super(message);
  }
}
