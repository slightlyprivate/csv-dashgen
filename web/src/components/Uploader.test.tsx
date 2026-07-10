import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Uploader from '../components/Uploader'
import { ConfigProvider } from '../contexts/ConfigContext'

describe('Uploader Component', () => {
  const mockOnDatasetLoaded = vi.fn()
  const mockOnError = vi.fn()

  it('should render upload area', () => {
    render(
      <ConfigProvider>
        <Uploader onDatasetLoaded={mockOnDatasetLoaded} onError={mockOnError} />
      </ConfigProvider>
    )

    expect(screen.getByText('Drop in a file')).toBeInTheDocument()
    expect(
      screen.getByText('Drag a CSV or TSV here, or click to browse')
    ).toBeInTheDocument()
  })

  it('should show file input', () => {
    render(
      <ConfigProvider>
        <Uploader onDatasetLoaded={mockOnDatasetLoaded} onError={mockOnError} />
      </ConfigProvider>
    )

    const fileInput = document.querySelector(
      'input[type="file"][accept=".csv,.tsv"]'
    ) as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', '.csv,.tsv')
  })

  it('should show supported formats info', () => {
    render(
      <ConfigProvider>
        <Uploader onDatasetLoaded={mockOnDatasetLoaded} onError={mockOnError} />
      </ConfigProvider>
    )

    expect(screen.getByText(/Up to \d+ MB/)).toBeInTheDocument()
  })
})
