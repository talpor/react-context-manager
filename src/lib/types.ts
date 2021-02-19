import { Context } from 'react';

export interface GlobalStore {
  readonly [key: string]: any;
}

/*
  Modifiers
*/

// (store) => (userid: number) => globalStore
export type Modifier<GS extends GlobalStore> = (
  store: GS
) => (...args: ReadonlyArray<any>) => Partial<GS> | Promise<Partial<GS>>;
export interface UnBoundAction<GS extends GlobalStore> extends Modifier<GS> {}

// { add: Modifier, edit: Modifier, ... }
export interface Scope<GS extends GlobalStore> {
  readonly [actionName: string]: Modifier<GS>;
}
export interface UnBoundScope<GS extends GlobalStore> extends Scope<GS> {}

// { user: Scope, auth: Scope, calendar: Scope ...}
export interface Modifiers<GS extends GlobalStore> {
  readonly [scope: string]: Scope<GS>;
}
export interface UnBoundActions<GS extends GlobalStore> extends Modifiers<GS> {}

/*
  Actions
*/
export type Action<GS extends GlobalStore, M extends Modifier<GS>> = (
  ...args: Parameters<ReturnType<M>>
) => void;
// (userid: number) => void
export interface BoundAction<
  GS extends GlobalStore,
  M extends UnBoundAction<GS>
> extends Action<GS, M> {}

// {{ add: Action, edit: Action, ... }}
export type NameSpace<GS extends GlobalStore, S extends Scope<GS>> = {
  readonly [A in keyof S]: Action<GS, S[A]>;
};
export type BoundScope<GS extends GlobalStore, S extends UnBoundScope<GS>> = {
  readonly [A in keyof S]: BoundAction<GS, S[A]>;
};

// { user: NameSpace, auth: NameSpace, ...}
export type Actions<GS extends GlobalStore, T extends UnBoundActions<GS>> = {
  readonly [S in keyof T]: NameSpace<GS, T[S]>;
};

export interface ContextObject<
  GS extends GlobalStore,
  M extends Modifiers<GS>
> {
  readonly actions: Context<Actions<GS, M>>;
  readonly store: Context<GS>;
}
