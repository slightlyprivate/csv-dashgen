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

    expect(screen.getByText('Upload CSV File')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Drag and drop your CSV or TSV file here, or click to browse'
      )
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

    expect(
      screen.getByText('Supported formats: .csv, .tsv')
    ).toBeInTheDocument()
    expect(screen.getByText(/Maximum file size:/)).toBeInTheDocument()
  })
})
