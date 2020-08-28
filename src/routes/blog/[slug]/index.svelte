<script context="module" lang="ts">
  import { getPageData } from "../../../lib/ssrApi"
  export async function preload({ path }) {
    return await getPageData(this, path)
  }
</script>

<script lang="ts">
  import api from "../../../lib/api"
  import Head from "../../../components/Head.svelte"
  import type { IndexData } from "./_types"
  export let post: IndexData["post"]

  async function like() {
    const res = await api.post("like.json")
    if (res.ok) post = await res.json()
    else alert(JSON.stringify(await res.json()))
  }
</script>

<style lang="scss">
  /*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
  .content {
    :global(h2) {
      font-size: 1.4em;
      font-weight: 500;
    }

    :global(pre) {
      background-color: #f9f9f9;
      box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
      padding: 0.5em;
      border-radius: 2px;
      overflow-x: auto;
    }

    :global(pre) :global(code) {
      background-color: transparent;
      padding: 0;
    }

    :global(ul) {
      line-height: 1.5;
    }

    :global(li) {
      margin: 0 0 0.5em 0;
    }
  }
</style>

<Head title={post.title} description="Page for {post.title}" />

<h1>{post.title}</h1>

<div class="content">
  {@html post.html}
</div>

<button on:click={like}>
  {#if !post.likes}
    Like
  {:else if post.likes === 1}{post.likes} Like{:else}{post.likes} Likes{/if}
</button>
