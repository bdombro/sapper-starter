<script context="module" lang="ts">
  export async function preload({ path }, session) {
    return this.redirect(302, session?.i ? `${path}/profile` : `${path}/login`)
  }
</script>
