

type Handler<T = any> = (payload: T) => Promise<void> | void;

class EventBus {
  private listeners = new Map<string, Handler[]>();

  subscribe(event: string, handler: Handler) {
    const handlers = this.listeners.get(event) ?? [];
    handlers.push(handler);
    this.listeners.set(event, handlers);
  }

  publish(event: string, payload: unknown) {
    const handlers = this.listeners.get(event) ?? [];

    for (const handler of handlers) {
      Promise.resolve(handler(payload)).catch((error) => {
        console.error(`[EventBus] Error en ${event}`, error);
      });
    }
  }
}

export const eventBus = new EventBus();