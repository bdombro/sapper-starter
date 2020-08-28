<script>
  import Head from "../../components/Head.svelte"
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
    margin: 0 0 1em 0;

    img {
      width: 100%;
      max-width: 400px;
      margin: 0 0 1em 0;
    }
  }

  p {
    margin: 1em auto;
  }
</style>

<Head title="Dashboard" description="Sapper Starter Dashboard" />

<h1>Great success!</h1>

<figure>
  <img alt="Success Kid" src="successkid.jpg" />
  <figcaption>Have fun with Sapper!</figcaption>
</figure>

<p>
  <strong>
    Try editing this file (src/routes/index.svelte) to test live reloading.
  </strong>
</p>
