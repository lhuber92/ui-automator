<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Icons from './Icons.svelte';

  let value = $page.url.searchParams.get('q');

  async function submit(e) {
    e.preventDefault();
    let query = new URLSearchParams();
    if (value) {
      query.set('q', value);
    }
    await goto(`/search${query ? `?${query}` : ''}`, { keepFocus: true });
  }
</script>

<form on:submit|preventDefault={submit} class="relative flex w-full items-center">
  <div class="absolute top-0 right-0 mr-2">
    <button type="submit" aria-label="Submit Search" data-ui-automation-element="search-button">
      <Icons strokeColor="#fff" type="search" />
    </button>
  </div>
  <input
    data-ui-automation-element="search-field"
    type="text"
    bind:value
    placeholder="Search for products..."
    autocomplete="off"
    class="w-full border border-white/30 bg-transparent p-2"
  />
</form>
