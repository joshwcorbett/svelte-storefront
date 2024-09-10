<script lang="ts">
import type { CartLineInput } from '$lib/types'
import { applyAction, deserialize } from '$app/forms'
import { page } from '$app/stores'
import { invalidateAll } from '$app/navigation'
import { getCartState } from '$lib/state/cart.svelte'

const cart = getCartState()

let { lines = [], disabled = false } = $props<{
  lines: CartLineInput[]
  disabled: boolean
}>()

let { selectedLocale } = $derived($page.data)
let status = $state('idle')

let label = $derived.by(() => {
  switch (status) {
    case 'idle':
      return 'Add To Cart'
    case 'adding':
      return 'Adding...'
    case 'added':
      return 'Added'
    case 'error':
      return 'Could\'nt add to cart'
  }
})

$effect(() => {
  if (status === 'added' || status === 'error') {
    setTimeout(() => {
      status = 'idle'
    }, 1750)
  }
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  status = 'adding'

  const data = new FormData(e.target as HTMLFormElement)
  const result = await cart.add(data)
  status = result.type === 'success'
    ? 'added'
    : 'error'
  applyAction(result)
}
</script>

<form onsubmit={handleSubmit}>
  <input type="hidden" name="lines" value={JSON.stringify(lines)} />
  <input type="hidden" name="countryCode" value={selectedLocale.country} />

  <button
    type="submit"
    {disabled}
  >
    {label}
  </button>
</form>
