declare module "next-themes" {
  import { ReactNode } from "react";

  export interface ThemeProviderProps {
    children: ReactNode;
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
  }

  export function ThemeProvider(props: ThemeProviderProps): JSX.Element;
}

declare module "@/providers/WebSocketProvider" {
  import { ReactNode } from "react";

  export interface WebSocketProviderProps {
    children: ReactNode;
  }

  export function WebSocketProvider(props: WebSocketProviderProps): JSX.Element;
}

declare module "@/components/global/GlobalAlert" {
  import { ReactNode } from "react";

  export interface AlertProviderProps {
    children: ReactNode;
  }

  export function AlertProvider(props: AlertProviderProps): JSX.Element;
}

// Add React hooks and type declarations
declare module "react" {
  // Hooks
  export function useState<T>(
    initialState: T | (() => T)
  ): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(
    effect: () => void | (() => void),
    deps?: any[]
  ): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<S, A>(
    reducer: (state: S, action: A) => S,
    initialState: S
  ): [S, (action: A) => void];
  export function useCallback<T extends (...args: any[]) => any>(
    callback: T,
    deps: any[]
  ): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useLayoutEffect(
    effect: () => void | (() => void),
    deps?: any[]
  ): void;

  // Types
  export type ReactNode = any;
  export type ReactElement = any;

  // Component types
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P): JSX.Element | null;
  }

  // Context
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  export interface Provider<T> {
    (props: { value: T; children?: ReactNode }): ReactElement | null;
  }
  export interface Consumer<T> {
    (props: { children: (value: T) => ReactNode }): ReactElement | null;
  }
  export function createContext<T>(defaultValue: T): Context<T>;
}

// Add Next.js navigation module
declare module "next/navigation" {
  export function useRouter(): {
    push(url: string): void;
    replace(url: string): void;
    refresh(): void;
    back(): void;
    forward(): void;
    prefetch(url: string): void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
}
