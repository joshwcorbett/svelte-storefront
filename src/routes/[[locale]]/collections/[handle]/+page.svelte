<script lang="ts">
import { page } from '$app/stores'
import { goto } from '$app/navigation'

let { data } = $props()
let collection = $state(data.collection)
let loading = $state(false)

const { endCursor, hasNextPage } = $derived(data.collection.products.pageInfo)

const loadMore = async (e: Event) => {
  e.preventDefault()
  if (!endCursor || !hasNextPage || loading) return

  loading = true
  const url = new URL($page.url)
  url.searchParams.set('after', endCursor)

  await goto(url, {
    replaceState: true,
    noScroll: true
  })

  collection = {
    ...collection,
    products: {
      ...collection.products,
      nodes: [
        ...collection.products.nodes,
        ...data.collection.products.nodes
      ]
    }
  }

  loading = false
}

</script>

<div class="grid grid-cols-6 gap-4">
  {#each collection.products.nodes as product (product.id)}
    <a href="/products/{product.handle}" class="col-span-1 bg-gray-100">
      {product.title}
    </a>
  {/each}
</div>

{#if hasNextPage}
  <button disabled={loading} onclick={loadMore}>
    { loading ? 'Loading...' : 'Load more products' }
  </button>
{/if}
