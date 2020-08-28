<script lang="ts">
  import { stores } from "@sapper/app"
  import Nav from "../components/Nav.svelte"
  export const fullScreenPaths = new Set([])
  export let segment: string
  export let page = stores().page
</script>

<style lang="scss">
  main {
    position: relative;
    max-width: 56em;
    background-color: white;
    padding: 2em;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>

{#if !fullScreenPaths.has($page.path)}
  <Nav {segment} />
{/if}

<main>
  <slot />
</main>
