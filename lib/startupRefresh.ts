type StartupRefreshListener = (startupId: string) => void;

const listeners = new Set<StartupRefreshListener>();

export function subscribeStartupRefresh(listener: StartupRefreshListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyStartupRefresh(startupId: string) {
  listeners.forEach((listener) => listener(startupId));
}
