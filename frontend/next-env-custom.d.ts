// Fixes "Cannot find module 'react'"
declare module "react" {
  export type ReactNode =
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | readonly ReactNode[];

  export interface ReactElement {
    type: any;
    props: any;
    key: any;
  }
}
