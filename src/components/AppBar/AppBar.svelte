<script lang="ts">
  import { stores } from "@sapper/app"
  import {
    mdiAccount,
    mdiHomeCity,
    mdiInformationOutline,
    mdiNewspaperVariantOutline,
    mdiPalette,
  } from "@mdi/js"
  import AppBar from "svelte-materialify/src/components/AppBar"
  import Avatar from "svelte-materialify/src/components/Avatar"
  import Button from "svelte-materialify/src/components/Button"
  import Divider from "svelte-materialify/src/components/Divider"
  import List from "svelte-materialify/src/components/List"
  import themeStore from "../../theme"
  import NavListItem from "../NavListItem.svelte"

  export let segment: string

  let session = stores().session
  let active = false
</script>

<style lang="scss">
  @import 'svelte-materialify/src/styles/variables';

  .outer {
    position: relative;
    height: 50px;

    > .inner {
      position: absolute;
      width: 100%;
      z-index: 1;
      @media (min-width: map-get($grid-breakpoints, 'md')) {
        display: none;
      }

      .menu-drawer {
        height: 0;
        transition: height .4s ease-in-out;
        overflow: hidden;
        background-color: var(--theme-surface);
        box-sizing: border-box;

        &::-webkit-scrollbar {
          width: 14px; /* width of the entire scrollbar */
        }

        &::-webkit-scrollbar-track {
          background: var(--theme-navigation-drawer); /* color of the tracking area */
        }

        &::-webkit-scrollbar-thumb {
          background-color: #707070; /* color of the scroll thumb */
          border-radius: 20px; /* roundness of the scroll thumb */
          border: 3px solid var(--theme-navigation-drawer); /* creates padding around scroll thumb */
        }

        &.active {
          border-bottom: 6px solid black;
          height: calc(100vh - 50px);
          overflow-y: auto;
        }
      }
    }
  }

</style>

<div class="outer">
  <div class="inner">

    <AppBar dense>
      <span slot="title">
        <span class="ml-n2">
          <Avatar size={40}><img src="//picsum.photos/200" alt="profile" /></Avatar>
        </span>
        Sapper App GT
      </span>
      <div style="flex-grow:1" />
      {#if !active}
        <Button on:click={()=>active=true} class="mr-2">Menu</Button>
      {:else}
        <Button on:click={()=>active=false} class="mr-2">Close</Button>
      {/if}
    </AppBar>

    <div class="menu-drawer {active && 'active'}">
      <div on:click={()=>active=false}>
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
        <Divider />
        <List dense nav>
          <NavListItem
            title="Switch Theme"
            href="action:toggleTheme"
            onclick={() => themeStore.update(last => last === 'dark' ? 'light' : 'dark')}
            icon={mdiPalette} />
        </List>
      </div>
    </div>
  </div>
</div>

