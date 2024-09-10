import { gql } from '@apollo/client/core'
import {
  PRODUCT_CARD_FRAGMENT,
  BRANDING_FRAGMENT,
  MEDIA_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  SHOP_FRAGMENT,
  MENU_FRAGMENT,
  CART_FRAGMENT,
  LINES_CART_FRAGMENT,
  USER_ERROR_FRAGMENT,
} from './fragments'

export const layoutQuery = gql`
  ${BRANDING_FRAGMENT}
  ${SHOP_FRAGMENT}
  ${MENU_FRAGMENT}
  query layout (
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext (language: $language) {
    shop {
      ...Shop
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
`

export const collectionQuery = gql`
  ${PRODUCT_CARD_FRAGMENT}

  query CollectionDetails (
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $afterCursor: String
    $beforeCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
  ) @inContext (
    country: $country,
    language: $language
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $pageBy,
        before: $beforeCursor,
        after: $afterCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        filters {
          id
          label
          type
          values {
            id
            label
            count
            input
          }
        }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`

export const productQuery = gql`
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  query Product (
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext (
    country: $country,
    language: $language
  ) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      selectedVariant: variantBySelectedOptions (selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media (first: 10) {
        nodes {
          ...Media
        }
      }
      variants (first: 250) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        title
        description
      }
    }
  }
`

export const recommendedProductsQuery = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query productRecommendations (
    $productId: ID!
    $count: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (
    country: $country,
    language: $language
  ) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`

export const CART_QUERY = gql`
  ${CART_FRAGMENT}
  query CartQuery (
    $cartId: ID!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext (
    country: $country,
    language: $language
  ) {
    cart (id: $cartId) {
      ...CartFragment
    }
  }
`

export const CREATE_CART_MUTATION = gql`
  ${USER_ERROR_FRAGMENT}
  ${CART_FRAGMENT}
  mutation (
    $input: CartInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartCreate (input: $input) {
      cart {
        ...CartFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const ADD_LINES_MUTATION = gql`
  ${CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation (
    $cartId: ID!
    $lines: [CartLineInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartLinesAdd (cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const REMOVE_LINES_MUTATION = gql`
  ${CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation (
    $cartId: ID!
    $lineIds: [ID!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartLinesRemove (cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const DISCOUNT_CODES_UPDATE = gql`
  ${CART_FRAGMENT}
  mutation cartDiscountCodesUpdate (
    $cartId: ID!
    $discountCodes: [String!]
    $country: CountryCode
  ) @inContext (country: $country) {
    cartDiscountCodesUpdate (cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartFragment
      }
      errors: userErrors {
        field
        message
      }
    }
  }
`

export const LINES_UPDATE_MUTATION = gql`
  ${LINES_CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
  mutation (
    $cartId: ID!
    $lines: [CartLineUpdateInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartLinesUpdate (cartId: $cartId, lines: $lines) {
      cart {
        ...CartLinesFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`

export const UPDATE_CART_BUYER = gql`
  ${USER_ERROR_FRAGMENT}
  mutation (
    $cartId: ID!
    $buyer: CartBuyerIdentityInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext (country: $country, language: $language) {
    cartBuyerIdentityUpdate (cartId: $cartId, buyer: $buyer) {
      cart {
        id
        buyerIdentity {
          email
          phone
          countryCode
        }
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
`
