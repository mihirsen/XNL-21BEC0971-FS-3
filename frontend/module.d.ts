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
  export function useEffect(
    effect: () => void | (() => void),
    deps?: any[]
  ): void;

  export type ReactNode = any;

  // Add FC type for functional components
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P): JSX.Element | null;
  }
}

// Add Next.js navigation module
declare module "next/navigation" {
  export function useRouter(): {
    push(url: string): void;
    // Add more methods as needed
  };
}
