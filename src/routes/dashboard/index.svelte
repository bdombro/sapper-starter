<script context="module" lang="ts">
  export async function preload({ path }) {
    return { path }
  }
</script>

<script lang="ts">
  import Head from "../../components/Head.svelte"
  import Image from "../../components/Image.svelte"

  export let path: string
  $: centerImage = `${path}/images/center.json`
</script>

<style lang="scss">
  h1,
  figure,
  p {
    text-align: center;
  }

  h1 {
    font-size: 2.8em;
    text-transform: uppercase;
    font-weight: 700;
    margin: 0 0 0.5em 0;

    @media (min-width: 480px) {
      font-size: 8em;
    }
  }

  figure {
    margin: 0 auto;
    max-width: 400px;
  }

  p {
    margin: 1em auto;
  }
</style>

<Head title="Dashboard" description="Sapper Starter Dashboard" />

<h1>Great success!</h1>
<figure>
  <Image src={centerImage} initialHeight="266px" alt="Good Job!" />
  <figcaption>Have fun with Sapper!</figcaption>
</figure>

<p>
  <strong>
    Try editing this file (src/routes/index.svelte) to test live reloading.
  </strong>
</p>
