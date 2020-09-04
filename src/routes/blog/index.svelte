<script context="module" lang="ts">
  import { getPageData } from "../../lib/ssrApi"
  export async function preload({ path }) {
    const data = await getPageData(this, path)
    return data
  }
</script>

<script type="ts">
  import Head from "../../components/Head.svelte"
  import type { Post } from "./_types"
  export let posts: Post[] = []
</script>

<style lang="scss">
  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }
</style>

<Head title="Blog" description="A blog demo" />

<h1>Recent posts</h1>

<ul>
  {#each posts as post}
    <!-- we're using the non-standard `rel=prefetch` attribute to
				tell Sapper to load the data for the page as soon as
				the user hovers over the link or taps it, instead of
				waiting for the 'click' event -->
    <li>
      <a rel="prefetch" href="blog/{post.slug}">{post.title} ({post.likes} likes)</a>
    </li>
  {/each}
</ul>
