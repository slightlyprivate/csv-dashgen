import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Uploader from '../components/Uploader'

describe('Uploader Component', () => {
  const mockOnDatasetLoaded = vi.fn()
  const mockOnError = vi.fn()

  it('should render upload area', () => {
    render(
      <Uploader
        onDatasetLoaded={mockOnDatasetLoaded}
        onError={mockOnError}
      />
    )

    expect(screen.getByText('Upload CSV File')).toBeInTheDocument()
    expect(screen.getByText('Drag and drop your CSV or TSV file here, or click to browse')).toBeInTheDocument()
  })

  it('should show file input', () => {
    render(
      <Uploader
        onDatasetLoaded={mockOnDatasetLoaded}
        onError={mockOnError}
      />
    )

    const fileInput = document.querySelector('input[type="file"][accept=".csv,.tsv"]') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
    expect(fileInput).toHaveAttribute('accept', '.csv,.tsv')
  })

  it('should show supported formats info', () => {
    render(
      <Uploader
        onDatasetLoaded={mockOnDatasetLoaded}
        onError={mockOnError}
      />
    )

    expect(screen.getByText('Supported formats: .csv, .tsv')).toBeInTheDocument()
    expect(screen.getByText('Maximum file size: 50MB')).toBeInTheDocument()
  })
})