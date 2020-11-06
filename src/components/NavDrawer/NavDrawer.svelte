<script lang="ts">
  import { stores } from "@sapper/app"
  import {
    mdiAccount,
    mdiHomeCity,
    mdiInformationOutline,
    mdiNewspaperVariantOutline,
    mdiPalette,
    mdiEye,
    mdiEyeOff
  } from "@mdi/js"
  import { onMount } from "svelte"
  import Avatar from "svelte-materialify/src/components/Avatar"
  import Divider from "svelte-materialify/src/components/Divider"
  import List from "svelte-materialify/src/components/List"
  import ListItem from "svelte-materialify/src/components/List/ListItem.svelte"
  import NavigationDrawer from "svelte-materialify/src/components/NavigationDrawer"
  import themeStore from "../../theme"
  import { isTouchable } from "../../lib/device"
  import NavListItem from "../NavListItem.svelte"

  export let segment: string

  let session = stores().session
  let mini = true
  let toggled = true

  let hoverEnabled = false
  onMount(() => hoverEnabled = !isTouchable())

  function mouseEnter() {
    if (hoverEnabled) mini = false
  }

  function mouseLeave() {
    if (hoverEnabled) mini = true
  }
</script>

<style lang="scss">
  @import 'svelte-materialify/src/styles/variables';

  .outer {
    width: 56px; // the width of the mini drawer
    z-index: 1;
    height: 100vh;

    @media (max-width: map-get($grid-breakpoints, 'md')) {
      display: none;
    }

    .inner {
      position: absolute;
      height: 100vh;

      .flexed {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }

    &.toggled {
      width: 240px;

      .inner {
        position: relative;
      }
    }
  }
</style>

<div class="outer {toggled && 'toggled'}">
  <div class="inner">
    <NavigationDrawer mini={mini && !toggled} style="max-width: 240px">
      <div class="flexed" on:mouseenter={mouseEnter} on:mouseleave={mouseLeave}>
        <div>
          <ListItem>
            <span slot="prepend" class="ml-n2">
              <Avatar size={40}><img src="//picsum.photos/200" alt="profile" /></Avatar>
            </span>
            Sapper App GT
          </ListItem>
          <Divider />
          <List dense nav>
            <NavListItem title="Home" href="dashboard" icon={mdiHomeCity} {segment} />
            <NavListItem title="Blog" href="blog" icon={mdiNewspaperVariantOutline} {segment} />
            {#if $session && $session.i}
              <NavListItem title="Profile" href="auth/profile" icon={mdiAccount} {segment} />
            {:else}
              <NavListItem title="Login" href="auth/login" icon={mdiAccount} {segment} />
            {/if}
            <NavListItem title="About" href="about" icon={mdiInformationOutline} {segment} />
          </List>
        </div>
        <div>
          <List dense nav>
            <NavListItem
              title="Switch Theme"
              href="action:toggleTheme"
              onclick={() => themeStore.update(last => last === 'dark' ? 'light' : 'dark')}
              icon={mdiPalette} />
            <NavListItem
              title={toggled ? 'Hide Sidebar' : 'Show Sidebar'}
              href="action:toggleSidebar"
              onclick={() => toggled = !toggled}
              icon={toggled ? mdiEyeOff : mdiEye} />
          </List>
        </div>
      </div>
    </NavigationDrawer>
  </div>
</div>