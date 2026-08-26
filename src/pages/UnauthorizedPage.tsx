import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <p className="text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">403</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-zinc-900">
        Unauthorized
      </h1>
      <p className="mt-2 text-zinc-500">You don't have access to this page.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
      >
        Back to Product Listing
      </Link>
    </section>
  )
}

export default UnauthorizedPage
