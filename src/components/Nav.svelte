<script lang="ts">
  import { stores } from "@sapper/app"
  export let session = stores().session
  export let segment: string
</script>

<style lang="scss">
  nav {
    border-bottom: 1px solid rgba(255, 62, 0, 0.1);
    font-weight: 300;
    padding: 0 1em;

    ul {
      margin: 0;
      padding: 0;

      /* clearfix */
      &::after {
        content: "";
        display: block;
        clear: both;
      }

      li {
        display: block;
        float: left;

        a {
          text-decoration: none;
          padding: 1em 0.5em;
          display: block;

          &[aria-current] {
            position: relative;
            display: inline-block;
          }

          &[aria-current]::after {
            position: absolute;
            content: "";
            width: calc(100% - 1em);
            height: 2px;
            background-color: rgb(255, 62, 0);
            display: block;
            bottom: -1px;
          }
        }
      }
    }
  }
</style>

<nav>
  <ul>
    <li>
      <a
        rel="prefetch"
        aria-current={segment === 'dashboard' ? 'page' : undefined}
        href="dashboard">
        home
      </a>
    </li>
    <li>
      <a
        rel="prefetch"
        aria-current={segment === 'about' ? 'page' : undefined}
        href="about">
        about
      </a>
    </li>

    <li>
      <a
        rel="prefetch"
        aria-current={segment === 'blog' ? 'page' : undefined}
        href="blog">
        blog
      </a>
    </li>

    <li>
      {#if $session && $session.i}
        <a
          rel="prefetch"
          aria-current={segment === 'auth' ? 'page' : undefined}
          href="auth/profile">
          profile
        </a>
      {:else}
        <a
          rel="prefetch"
          aria-current={segment === 'auth' ? 'page' : undefined}
          href="auth/login">
          login
        </a>
      {/if}
    </li>
  </ul>
</nav>
