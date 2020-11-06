<script>
  import AppBar from "svelte-materialify/src/components/AppBar"
  import Button from "svelte-materialify/src/components/Button"
  import Icon from "svelte-materialify/src/components/Icon"
  import Overlay from "svelte-materialify/src/components/Overlay"
  import NavigationDrawer from "svelte-materialify/src/components/NavigationDrawer"
  import { mdiMenu } from "@mdi/js"

  let active = false;
</script>

<style lang="scss">
  @import 'svelte-materialify/src/styles/variables';
  div {
    @media (min-width: map-get($grid-breakpoints, 'md')) {
      display: none;
    }
  }
</style>

<div>
  <AppBar dense>
    <span slot="title">Sapper App GT</span>
    <div style="flex-grow:1" />
    <Button>Nav Button</Button>
    <Button fab depressed on:click={()=>active=!active}>
      <Icon path={mdiMenu} />
    </Button>
  </AppBar>
</div>

<NavigationDrawer absolute right {active}>Content</NavigationDrawer>
<Overlay {active} absolute on:click={()=>active=!active} index={1} />
