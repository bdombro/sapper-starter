type Session = { i?: string; r?: number }
type Page = { host: string; path: string; params: string[]; query: string[] }
declare module "@sapper/app" {
  export function goto(
    to: string,
    options?: { replaceState?: boolean; noscroll?: boolean }
  ): Promise<void>
  export function stores(): {
    session: Session & {
      set: (next: Session) => Promise<void>
      subscribe: (callback: (next: Session) => void) => void
    }
    // page: Page & { subscribe: () => (next: Session) => void }
    page: Page & { subscribe: (callback: (next: Page) => void) => void }
    preloading: boolean
  }
  export function start({ target }: { target: HTMLAnchorElement }): unknown
}

declare module "@sapper/server" {
  export function middleware({ session }: { session: object }): void
}
