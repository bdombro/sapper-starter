<script lang="ts">
  import ListItem from "svelte-materialify/src/components/List/ListItem.svelte"
  import Icon from "svelte-materialify/src/components/Icon/Icon.svelte"

  export let title: string
  export let icon: string
  export let segment: string
  export let href: string
  export let fuzzyActive = true
  export let onclick: (e: any) => void

  $: active = segment === href || (fuzzyActive && href.includes(segment))
</script>

<a
  href={href}
  class="text-decoration-none"
  rel="prefetch"
  aria-current={active}
  on:click={(e) => {
    if (onclick) {
      if (href) e.preventDefault();
      onclick(e);
    }
  }}
>
  <ListItem {active}>
          <span slot="prepend">
            <Icon path={icon} />
          </span>
    {title}
  </ListItem>
</a>