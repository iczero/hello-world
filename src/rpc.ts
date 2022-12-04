import { onReady } from './ready';

export type RPCMethod = (args: Record<string, any>) => Promise<Record<string, any>>;
export const rpcMethods = new Map<string, RPCMethod>();

onReady(function initialize() {
  window.addEventListener('message', ev => {
    // TODO
  });
});
