import { collectionQuery } from '$lib/server/data'
import type { Collection } from '$lib/types'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ params, url, locals, parent }) => {
  const { handle } = params
  const { storefront, locale } = locals

  const paginationSize = 36
  const afterCursor = url.searchParams.get('after') || undefined
  const beforeCursor = url.searchParams.get('before') || undefined
  const filters = undefined
  const sortKey = url.searchParams.get('sort') || 'CREATED'
  const reverse = url.searchParams.get('reverse') === 'true'

  const { data } = await storefront.query<{collection: Collection}>({
    query: collectionQuery,
    variables: {
      country: locale.country,
      language: locale.language,
      handle,
      pageBy: paginationSize,
      afterCursor,
      beforeCursor,
      filters,
      sortKey,
      reverse
    }
  })

  if (!data.collection?.id)
    error(404, 'Collection not found')

  const collection = data.collection as Collection

  const seo = {
    ...collection.seo,
    title: collection.seo.title || collection.title,
    description: collection.seo.description || collection.description
  }

  return {
    collection: data.collection,
    seo,
  }
}
