import { useParams } from 'react-router-dom'

function AssetDetail() {
  const { assetId } = useParams()

  return (
    <section>
      <h1>Asset Detail</h1>
      <p>assetId: {assetId}</p>
    </section>
  )
}

export default AssetDetail
