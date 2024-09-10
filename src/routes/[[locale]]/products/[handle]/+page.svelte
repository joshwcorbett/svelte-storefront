<script lang="ts">
import ProductView from '$lib/components/Product/View.svelte'

const {data} = $props()
</script>

<ProductView product={data.product} />
