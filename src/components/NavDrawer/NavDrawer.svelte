<script lang="ts">
  import { stores } from "@sapper/app"
  import { onMount } from 'svelte';
  import {
    mdiAccount,
    mdiHomeCity,
    mdiInformationOutline,
    mdiNewspaperVariantOutline,
    mdiPalette,
    mdiEye,
    mdiEyeOff
  } from "@mdi/js"
  import NavigationDrawer from "svelte-materialify/src/components/NavigationDrawer"
  import List from "svelte-materialify/src/components/List"
  import ListItem from "svelte-materialify/src/components/List/ListItem.svelte"
  import Avatar from "svelte-materialify/src/components/Avatar"
  import Divider from "svelte-materialify/src/components/Divider"
  import themeStore from "../../theme"
  import NavListItem from "./ListItem.svelte"

  export let session = stores().session

  export let segment: string
  let mini = true
  let toggled = false

  onMount(() => {
    toggled = window.innerWidth > 1000;
  });

  function mouseenter() {
    mini = false
  }

  function mouseleave() {
    mini = true
  }
</script>

<style lang="scss">
  .outer {
    width: 100px;
    z-index: 1;
    height: 100vh;

    .inner {
      position: absolute;
      width: 240px;
      height: 100vh;

      .flexed {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }

    &.toggled {
      width: auto;

      .inner {
        position: relative;
      }
    }
  }
</style>

<div class="outer {toggled && 'toggled'}">
  <div class="inner">
    <NavigationDrawer mini={mini && !toggled}>
      <div class="flexed" on:mouseenter={mouseenter} on:mouseleave={mouseleave}>
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