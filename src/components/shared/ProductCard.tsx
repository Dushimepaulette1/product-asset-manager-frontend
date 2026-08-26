import type { ProductWithStartingPrice } from '../../models/types.ts'
import ProductImage from './ProductImage.tsx'

interface ProductCardProps {
  product: ProductWithStartingPrice
  onClick: () => void
}

function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white/70 text-left transition-shadow hover:shadow-lg hover:shadow-zinc-200/60"
    >
      <div className="aspect-square w-full overflow-hidden">
        <ProductImage
          imageUrl={product.imageUrl}
          name={product.name}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          {product.categoryName}
        </p>
        <h3 className="font-medium text-zinc-900">{product.name}</h3>
        <p className="mt-auto pt-2 text-sm font-semibold text-zinc-900">
          {product.startingPrice !== undefined ? `$${product.startingPrice.toFixed(2)}` : '—'}
        </p>
      </div>
    </button>
  )
}

export default ProductCard
