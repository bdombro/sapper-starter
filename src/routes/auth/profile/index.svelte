<script context="module">
  import { getPageData } from "../../../lib/ssrApi"
  export async function preload({ path }) {
    return await getPageData(this, path)
  }
</script>

<script lang="ts">
  import api from "../../../lib/api"
  import Head from "../../../components/Head.svelte"
  import { goto, stores } from "@sapper/app"
  import type { IndexData } from "./_types"
  export let user: IndexData["user"]
  let session = stores().session

  async function logout() {
    const res = await api.post("logout")
    if (res.ok) {
      session.set({})
      goto("/auth/login")
    } else alert(JSON.stringify(await res.json()))
  }
</script>

<style lang="scss">
  pre {
    background: #ccc;
    overflow-x: scroll;
    padding: 5px;
  }
</style>

<Head
  title="{user.givenName}
  {user.surname}"
  description="User profile for {user.givenName}
  {user.surname}" />

<h1>{user.givenName} {user.surname}</h1>

<pre>{JSON.stringify(user, null, 2)}</pre>

<button on:click={logout}>Click to Logout</button>
