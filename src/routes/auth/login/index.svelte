<script lang="ts">
  import { goto, stores } from "@sapper/app";
  import api from "../../../lib/api";
  import Head from "../../../components/Head.svelte";
  import { adminUserAuth } from "../_users";
  import type { LoginCreds, Session } from "./_types";
  export let redirecting = false;
  export let session = stores().session;

  async function login() {
    const creds: LoginCreds = {
      username: adminUserAuth.username,
      password: adminUserAuth.password,
    };
    const res = await api.post(".", creds);
    if (res.ok) {
      redirecting = true;
      const sessionNext: Session = await res.json();
      session.set(sessionNext);
      setTimeout(() => goto("/"), 1000);
    } else alert(JSON.stringify(await res.json()));
  }
  async function logout() {
    const res = await api.post("logout");
    if (res.ok) session.set({});
    else alert(JSON.stringify(await res.json()));
  }
</script>

<Head title="Login" description="Login Page" />

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
