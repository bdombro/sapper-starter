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
