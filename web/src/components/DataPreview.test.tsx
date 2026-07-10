import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataPreview from './DataPreview'
import { Dataset } from '../types'

function buildDataset(): Dataset {
  return {
    headers: ['name', 'amount'],
    rows: [
      { name: 'Bob', amount: 20 },
      { name: 'Alice', amount: 10 },
      { name: 'Cara', amount: 30 },
    ],
    columnTypes: { name: 'string', amount: 'number' },
    filename: 'test.csv',
    size: 123,
  }
}

function bodyRows() {
  const table = screen.getByRole('table')
  const tbody = table.querySelector('tbody')!
  return within(tbody).getAllByRole('row')
}

describe('DataPreview', () => {
  it('renders all rows by default', () => {
    render(<DataPreview dataset={buildDataset()} />)
    expect(bodyRows()).toHaveLength(3)
    expect(screen.getByText('3 rows')).toBeInTheDocument()
  })

  it('sorts rows ascending then descending on header click', async () => {
    const user = userEvent.setup()
    render(<DataPreview dataset={buildDataset()} />)

    await user.click(screen.getByRole('button', { name: 'amount' }))
    expect(bodyRows()[0]).toHaveTextContent('Alice')

    await user.click(screen.getByRole('button', { name: 'amount' }))
    expect(bodyRows()[0]).toHaveTextContent('Cara')
  })

  it('filters rows by text and shows the filtered count', async () => {
    const user = userEvent.setup()
    render(<DataPreview dataset={buildDataset()} />)

    await user.click(screen.getByRole('button', { name: /^filter/i }))
    await user.type(screen.getByPlaceholderText('contains…'), 'ali')

    expect(bodyRows()).toHaveLength(1)
    expect(bodyRows()[0]).toHaveTextContent('Alice')
    expect(screen.getByText('1 row (filtered from 3)')).toBeInTheDocument()
  })

  it('clears filters via the Clear button', async () => {
    const user = userEvent.setup()
    render(<DataPreview dataset={buildDataset()} />)

    await user.click(screen.getByRole('button', { name: /^filter/i }))
    await user.type(screen.getByPlaceholderText('contains…'), 'ali')
    expect(bodyRows()).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(bodyRows()).toHaveLength(3)
  })

  it('paginates rows according to the configured page size', async () => {
    const user = userEvent.setup()
    render(<DataPreview dataset={buildDataset()} maxRows={2} />)

    expect(bodyRows()).toHaveLength(2)
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(bodyRows()).toHaveLength(1)
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()
  })
})
