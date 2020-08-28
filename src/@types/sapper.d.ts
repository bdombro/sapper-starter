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
      subscribe: () => (next: Session) => void
    }
    page: Page & { subscribe: () => (next: Session) => void }
    preloading: boolean
  }
}
