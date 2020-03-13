import { Context } from 'react';

export interface GlobalStore {
  readonly [key: string]: any;
}

// (store) => (userid: number) => globalStore
export type UnBoundAction<GS extends GlobalStore> = (
  store: GS
) => (...args: ReadonlyArray<any>) => GS | Promise<GS>;

// (userid: number) => void
export type BoundAction<GS extends GlobalStore, T extends UnBoundAction<GS>> = (
  ...args: Parameters<ReturnType<T>>
) => void;

// { user: { add: UnBoundAction }}
export interface UnBoundScope<GS extends GlobalStore> {
  readonly [actionName: string]: UnBoundAction<GS>;
}

// { user: { add: BoundAction }}
export type BoundScope<GS extends GlobalStore, S extends UnBoundScope<GS>> = {
  readonly [A in keyof S]: BoundAction<GS, S[A]>
};

export interface UnBoundActions<GS extends GlobalStore> {
  readonly [scope: string]: UnBoundScope<GS>;
}

export type Actions<GS extends GlobalStore, T extends UnBoundActions<GS>> = {
  readonly [S in keyof T]: BoundScope<GS, T[S]>
};

export interface ContextObject<
  GS extends GlobalStore,
  UA extends UnBoundActions<GS>
> {
  readonly actions: Context<Actions<GS, UA>>;
  readonly store: Context<GS>;
}
