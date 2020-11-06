<script>
  import {
    AppBar,
    Button,
    Icon,
    NavigationDrawer,
    Overlay,
  } from 'svelte-materialify/src';
  import { mdiMagnify, mdiMenu } from "@mdi/js"

  let active = false;
  function toggleNavigation() {
    active = !active;
  }
</script>

<AppBar dense>
  <div slot="icon">
    <Button fab depressed on:click={toggleNavigation}>
      <Icon path={mdiMenu} />
    </Button>
  </div>
  <span slot="title">Title</span>
  <div style="flex-grow:1" />
  <Button>Item</Button>
  <Button fab depressed>
    <Icon path={mdiMagnify} />
  </Button>
</AppBar>

<NavigationDrawer absolute {active}>Content</NavigationDrawer>
<Overlay {active} absolute on:click={toggleNavigation} index={1} />
