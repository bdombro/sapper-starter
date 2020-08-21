<script context="module">
  export async function preload({ path }) {
    const res = await this.fetch(`${path}.json`);
    const data = await res.json();
    if (res.status === 200) {
      return { user: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import type { User } from "../types";
  export let user: User;
  let session = stores().session;

  async function logout() {
    await fetch(`${location.pathname}/logout.json`, {
      method: "POST",
    });
    session.set({});
    return goto("/auth/login");
  }
</script>

<style lang="scss">
  pre {
    background: #ccc;
    overflow-x: scroll;
    padding: 5px;
  }
</style>

<svelte:head>
  <title>{user.givenName} {user.surname}</title>
</svelte:head>

<h1>{user.givenName} {user.surname}</h1>

<pre>{JSON.stringify(user, null, 2)}</pre>

<button on:click={logout}>Click to Logout</button>
