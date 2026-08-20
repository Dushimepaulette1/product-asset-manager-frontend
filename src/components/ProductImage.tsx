interface ProductImageProps {
  imageUrl?: string
  name: string
  className?: string
}

function ProductImage({ imageUrl, name, className = '' }: ProductImageProps) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={`object-cover ${className}`} />
  }

  const initial = name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 ${className}`}
    >
      <span className="font-display text-4xl font-semibold text-zinc-300">{initial}</span>
    </div>
  )
}

export default ProductImage
