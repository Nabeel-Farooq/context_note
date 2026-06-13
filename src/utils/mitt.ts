import mitt, { Emitter } from "mitt";

type EventMap = Record<string, unknown>;

interface ExtendedEmitter extends Emitter<EventMap> {
  once<T = unknown>(
    type: string,
    handler: (event: T) => void
  ): void;
}

const mittEmitter = mitt<EventMap>();

const emitter: ExtendedEmitter = {
  ...mittEmitter,

  once<T = unknown>(
    type: string,
    handler: (event: T) => void
  ): void {
    const wrappedHandler = (event: unknown) => {
      this.off(type, wrappedHandler);
      handler(event as T);
    };

    this.on(type, wrappedHandler);
  },
};

export default emitter;

export function sendEmitAndWait<
  TRequest = unknown,
  TResponse = unknown
>(
  name: string,
  data: TRequest
): Promise<TResponse> {
  return new Promise<TResponse>((resolve) => {
    const callbackEvent = `${name}-cb`;

    emitter.once<TResponse>(callbackEvent, (response) => {
      resolve(response);
    });

    emitter.emit(name, data);
  });
}
