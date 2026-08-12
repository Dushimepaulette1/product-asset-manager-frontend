import Button from '../components/Button.tsx'
import Input from '../components/Input.tsx'
import Select from '../components/Select.tsx'
import TextArea from '../components/TextArea.tsx'
import Badge from '../components/Badge.tsx'

function ProductListing() {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
      <h1>Product Listing</h1>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>

      <Input label="Product name" placeholder="e.g. Running Shoes" />
      <Input label="Product code" error="Product code is required" />

      <Select
        label="Category"
        options={[
          { label: 'Footwear', value: 'footwear' },
          { label: 'Apparel', value: 'apparel' },
        ]}
      />

      <TextArea label="Description" placeholder="Describe the product" />
      <TextArea label="Notes" error="This field can't be empty" />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Badge label="In Stock" color="green" />
        <Badge label="Low Stock" color="yellow" />
        <Badge label="Out of Stock" color="red" />
        <Badge label="User" color="blue" />
        <Badge label="Admin" color="purple" />
      </div>
    </section>
  )
}

export default ProductListing
