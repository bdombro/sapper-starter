<script lang="ts">
  import { stores } from "@sapper/app"
  import Button from "svelte-materialify/src/components/Button"
  import MaterialApp from "svelte-materialify/src/components/MaterialApp"
  import Snackbar from "svelte-materialify/src/components/Snackbar"
  import themeStore from "../theme"
  import NavDrawer from "../components/NavDrawer/NavDrawer.svelte"
  import AppBar from "../components/AppBar/AppBar.svelte"

  export const fullScreenPaths = new Set([])
  export let segment: string
  export let page = stores().page

  let session = stores().session
  let sessionSnackbar = null
  session.subscribe(() => sessionSnackbar = sessionSnackbar !== null)

  let theme: string
  themeStore.subscribe(themeNext => theme = themeNext)
</script>


<style lang="scss">
  .theme-body {
    display: flex;
    flex-direction: row;

    &.dark {
      scrollbar-width: thin;          /* "auto" or "thin"  */
      scrollbar-color: var(--theme-navigation-drawer) #707070;   /* scroll thumb & track */

      ::-webkit-scrollbar {
        width: 14px; /* width of the entire scrollbar */
      }
      ::-webkit-scrollbar-track {
        background: var(--theme-navigation-drawer); /* color of the tracking area */
      }
      ::-webkit-scrollbar-thumb {
        background-color: #707070; /* color of the scroll thumb */
        border-radius: 20px; /* roundness of the scroll thumb */
        border: 3px solid var(--theme-navigation-drawer); /* creates padding around scroll thumb */
      }
    }

    main {
      flex-grow: 2;
      height: 100vh;
      overflow-x: hidden;
      overflow-y: auto;
      //@media (max-width: map-get($grid-breakpoints, 'md')) {
      //  overflow-y: scroll;
      //}
    }
  }
</style>

<MaterialApp theme="{theme}">
  <div class="theme-body {theme}">
    {#if !fullScreenPaths.has($page.path)}
      <NavDrawer {segment} />
    {/if}

    <main>
      <Snackbar class="justify-space-between" bind:active={sessionSnackbar} right top offsetX="20px" timeout={3000}>
        {#if $session && $session.i}
          You've been logged in.
        {:else}
          You've been logged out.
        {/if}
        <Button text on:click={() => sessionSnackbar = false}>Dismiss</Button>
      </Snackbar>

      <AppBar {segment} />

      <slot />
    </main>
  </div>
</MaterialApp>