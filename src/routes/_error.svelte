<script lang="ts">
  export let status: string
  export let error: any

  const dev = process.env.NODE_ENV === 'development'
</script>

<style>
  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;

    @media (min-width: 480px) {
      font-size: 4em;
    }
  }

  p {
    margin: 1em auto;
  }
</style>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
