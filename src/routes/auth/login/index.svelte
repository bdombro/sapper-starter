<script lang="ts">
  import Button from 'svelte-materialify/src/components/Button';
  import { goto, stores } from "@sapper/app"
  import api from "../../../lib/api"
  import Head from "../../../components/Head.svelte"
  import { adminUserAuth, testPassword } from "../_users"
  import type { LoginCreds, Session } from "./_types"
  export let session = stores().session

  async function login() {
    const creds: LoginCreds = {
      username: adminUserAuth.username,
      password: testPassword,
    }
    const res = await api.post(".", creds)
    if (res.ok) {
      const sessionNext: Session = await res.json()
      session.set(sessionNext)
      goto("dashboard")
    } else {
      alert(JSON.stringify(await res.json()))
    }
  }
  async function logout() {
    const res = await api.post("logout")
    if (res.ok) session.set({})
    else alert(JSON.stringify(await res.json()))
  }
</script>

<Head title="Login" description="Login Page" />

<h1>Login</h1>
{#if $session && $session.i}
  <p>
    You're already logged in.
    <a href="logout" on:click|preventDefault={logout}>Logout?</a>
  </p>
{:else}
  <Button on:click={login}>Click to Login</Button>
{/if}
