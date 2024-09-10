<script lang="ts">
import HeadTemplate from '$lib/components/HeadTemplate.svelte'
import '../../app.css'
import { setCartState, getCartState } from '$lib/state/cart.svelte'

let {data, children} = $props()
let {shop, cart} = $derived(data.layout)

setCartState()
const cartState = getCartState()

$effect(() => {
  cartState.cart = cart
})
</script>

<HeadTemplate />

<header>
  <h1>{shop.name}</h1>
  {#await cart}
    <a href="/cart">Cart - 0 (fallback)</a>
  {:then cart}
    <a href="/cart">Cart - {cart?.totalQuantity ?? 0}</a>
  {:catch error}
    <a href="/cart">Cart - 0 (error)</a>
  {/await}
</header>

<main>
  {@render children()}
</main>
