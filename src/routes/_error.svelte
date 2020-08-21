<script lang="ts">
  export let status: string;
  export let error: any;

  const dev = process.env.NODE_ENV === "development";
</script>

<style lang="scss">
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

  pre {
    background: #ccc;
    overflow-x: scroll;
    padding: 5px;
  }
</style>

<svelte:head>
  <title>{status} | Sapper Starter</title>
  <meta name="description" content="Error Page" />
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>

{#if dev && error.stack}
  <pre>{error.stack}</pre>
{/if}
