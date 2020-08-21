<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import { adminUserAuth } from "../_users";
  export let redirecting = false;
  export let session = stores().session;

  async function login() {
    const sessionNext = await fetch(`${location.pathname}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: adminUserAuth.username,
        password: adminUserAuth.password,
      }),
    }).then((r) => r.json());
    redirecting = true;
    session.set(sessionNext);
    setTimeout(() => goto("/"), 1000);
  }
  async function logout() {
    await fetch(`${location.pathname}/logout.json`, {
      method: "POST",
    });
    session.set({});
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<h1>Login</h1>
{#if redirecting}
  <p>Success! Redirecting you home...</p>
{:else if $session?.i}
  <p>
    You're already logged in.
    <a href="logout" on:click|preventDefault={logout}>Logout?</a>
  </p>
{:else}
  <button on:click={login}>Click to Login</button>
{/if}
