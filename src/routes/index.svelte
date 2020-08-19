<script context="module">
  export async function preload(page, session) {
    // const { user } = session;

    // if (!user) {
    // 	return this.redirect(302, 'login');
    // }

    // return { user };
    return this.redirect(302, 'dashboard')
  }
</script>
