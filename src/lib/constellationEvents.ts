
type ArrivalListener = () => void;

const listeners = new Map<
  string,
  Set<ArrivalListener>
>();

export function emitNodeArrival(
  nodeId: string
): void {
  const nodeListeners = listeners.get(nodeId);

  if (!nodeListeners) return;

  for (const listener of nodeListeners) {
    listener();
  }
}

export function subscribeToNodeArrival(
  nodeId: string,
  listener: ArrivalListener
): () => void {
  let nodeListeners = listeners.get(nodeId);

  if (!nodeListeners) {
    nodeListeners = new Set();
    listeners.set(nodeId, nodeListeners);
  }

  nodeListeners.add(listener);

  return () => {
    nodeListeners.delete(listener);

    if (nodeListeners.size === 0) {
      listeners.delete(nodeId);
    }
  };
}
