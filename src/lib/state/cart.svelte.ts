import { deserialize } from '$app/forms'
import { invalidateAll } from '$app/navigation'
import type {
  CartLineInput,
  Cart,
  CartUserError,
  UserError
} from '$lib/types'
import { getContext, setContext } from 'svelte'

export class CartState {
  cart = $state<Cart | {}>({})
  errors = $state<CartUserError[] | UserError[]>([])

  constructor() {}

  async addLines(linesData: FormData) {
    const result = await fetch('/cart?/ADD_TO_CART', {
      method: 'POST',
      body: linesData,
    })
      .then(async (res) => deserialize(await res.text()))
      .catch((err) => console.error(err))

    this.updateCartWithResponse(result.data)
    return result
  }

  updateCartWithResponse(result: {
    cart?: Cart
    errors?: (CartUserError[] | UserError[]) | undefined
  }) {
    this.cart = (result.cart ?? {})
    this.errors = (result.errors ?? [])

    invalidateAll()
  }
}

const CART_KEY = Symbol('CART_STATE')

export const setCartState = () => {
  return setContext(CART_KEY, new CartState())
}

export const getCartState = () => {
  return getContext<ReturnType<typeof setCartState>>(CART_KEY)
}
