import { useState, useMemo, useEffect } from 'react'
import AppShell from './components/AppShell'
import TopBar from './components/TopBar'
import Sidebar, { SectionId } from './components/Sidebar'
import LandingHero from './components/LandingHero'
import DatasetHeader from './components/DatasetHeader'
import QuickReadStats from './components/QuickReadStats'
import AtAGlance from './components/AtAGlance'
import ChartIdeaCards from './components/ChartIdeaCards'
import ChartContainer from './components/ChartContainer'
import ColumnsList from './components/ColumnsList'
import ColumnProfile from './components/ColumnProfile'
import DataPreview from './components/DataPreview'
import Settings from './components/Settings'
import PrivacyNotice from './components/PrivacyNotice'
import HelpModal from './components/HelpModal'
import ToastContainer from './components/ToastContainer'
import Card from './components/ui/Card'
import SectionHeader from './components/ui/SectionHeader'
import { Dataset, ColumnType } from './types'
import { calculateDatasetStats, buildDatasetOverview } from './lib/statistics'
import { suggestChartConfigs } from './lib/charts'
import {
  usePersistentDataset,
  usePersistentColumnTypes,
  usePersistentChartConfig,
  useSessionManager,
} from './hooks/usePersistentState'
import { useScrollSpy } from './hooks/useScrollSpy'
import { ToastProvider } from './contexts/ToastContext'
import { useToast } from './hooks/useToast'

const SECTION_IDS = {
  overview: 'section-overview',
  columns: 'section-columns',
  charts: 'section-charts',
  data: 'section-data',
} as const

function AppContent() {
  const [showSettings, setShowSettings] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  const { dataset, updateDataset, clearDataset } = usePersistentDataset()
  const { columnTypes, updateColumnType, clearColumnTypes } =
    usePersistentColumnTypes(dataset?.filename || '')
  const { chartConfig, updateChartConfig, clearChartConfig } =
    usePersistentChartConfig()
  const { clearSession, hasSessionData } = useSessionManager()
  const { showError, showSuccess } = useToast()

  const datasetWithTypes = useMemo(() => {
    if (!dataset) return null
    return {
      ...dataset,
      columnTypes: { ...dataset.columnTypes, ...columnTypes },
    }
  }, [dataset, columnTypes])

  const stats = useMemo(() => {
    if (!datasetWithTypes) return []
    return calculateDatasetStats(
      datasetWithTypes.rows,
      datasetWithTypes.columnTypes
    )
  }, [datasetWithTypes])

  const overview = useMemo(() => {
    if (!datasetWithTypes) return null
    return buildDatasetOverview(datasetWithTypes, stats)
  }, [datasetWithTypes, stats])

  const suggestions = useMemo(() => {
    if (!datasetWithTypes) return []
    return suggestChartConfigs(datasetWithTypes)
  }, [datasetWithTypes])

  // Reset column selection whenever the loaded dataset changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedColumn(null)
  }, [dataset?.filename])

  const sectionIds = useMemo(
    () =>
      datasetWithTypes ? Object.values(SECTION_IDS) : [SECTION_IDS.overview],
    [datasetWithTypes]
  )
  const activeSectionRaw = useScrollSpy(sectionIds)
  const activeSection = (Object.entries(SECTION_IDS).find(
    ([, domId]) => domId === activeSectionRaw
  )?.[0] || 'overview') as SectionId

  const handleDatasetLoaded = (newDataset: Dataset) => {
    updateDataset(newDataset)
    showSuccess('Dataset loaded', `Loaded ${newDataset.filename}`)
    clearColumnTypes()
    updateChartConfig(null)
  }

  const handleError = (errorMessage: string) => {
    showError('Couldn’t load dataset', errorMessage)
  }

  const handleColumnTypeChange = (columnName: string, newType: ColumnType) => {
    updateColumnType(columnName, newType)
  }

  const handleClearSession = () => {
    clearDataset()
    clearColumnTypes()
    clearChartConfig()
    clearSession()
    setSelectedColumn(null)
  }

  const handleNavigate = (id: SectionId) => {
    document.getElementById(SECTION_IDS[id])?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }

  const header = <TopBar onOpenPrivacy={() => setShowPrivacy(true)} />

  const sidebar = (
    <Sidebar
      activeSection={activeSection}
      hasDataset={!!datasetWithTypes}
      onNavigate={handleNavigate}
      onOpenSettings={() => setShowSettings(true)}
      onOpenHelp={() => setShowHelp(true)}
    />
  )

  const main = !datasetWithTypes ? (
    <div id={SECTION_IDS.overview} className="scroll-mt-20">
      <LandingHero
        onDatasetLoaded={handleDatasetLoaded}
        onError={handleError}
      />
    </div>
  ) : (
    <div className="space-y-14">
      <div id={SECTION_IDS.overview} className="scroll-mt-20 space-y-6">
        <DatasetHeader
          dataset={datasetWithTypes}
          hasSessionData={hasSessionData}
          onUploadNew={() => updateDataset(null)}
          onClearSession={handleClearSession}
        />
        {overview && (
          <>
            <QuickReadStats overview={overview} />
            <AtAGlance overview={overview} />
          </>
        )}
      </div>

      <div id={SECTION_IDS.charts} className="scroll-mt-20">
        <SectionHeader
          eyebrow="Charts"
          title="Chart ideas"
          description="Start from a suggestion, then fine-tune it manually."
          className="mb-5"
        />
        <div className="space-y-5">
          <ChartIdeaCards
            dataset={datasetWithTypes}
            suggestions={suggestions}
            onSelect={updateChartConfig}
            maxVisible={6}
          />
          <ChartContainer
            dataset={datasetWithTypes}
            chartConfig={chartConfig}
            onConfigChange={updateChartConfig}
          />
        </div>
      </div>

      <div id={SECTION_IDS.columns} className="scroll-mt-20">
        <SectionHeader
          eyebrow="Columns"
          title="Column checkup"
          description="Type, quality, and shape for any column."
          className="mb-5"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
          <Card padding="sm">
            <ColumnsList
              dataset={datasetWithTypes}
              selectedColumn={selectedColumn}
              onSelectColumn={setSelectedColumn}
            />
          </Card>
          <Card padding="md">
            <ColumnProfile
              dataset={datasetWithTypes}
              stats={stats}
              selectedColumn={selectedColumn}
              onTypeChange={handleColumnTypeChange}
            />
          </Card>
        </div>
      </div>

      <div id={SECTION_IDS.data} className="scroll-mt-20">
        <SectionHeader
          eyebrow="Data"
          title="Preview rows"
          description="Sort, filter, and page through the raw data."
          className="mb-5"
        />
        <Card padding="md">
          <DataPreview
            dataset={datasetWithTypes}
            onColumnTypeChange={handleColumnTypeChange}
          />
        </Card>
      </div>
    </div>
  )

  return (
    <>
      <AppShell header={header} sidebar={sidebar} main={main} />

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onOpenPrivacy={() => {
          setShowSettings(false)
          setShowPrivacy(true)
        }}
        datasetInfo={
          datasetWithTypes
            ? {
                fileSize: datasetWithTypes.size,
                rowCount: datasetWithTypes.rows.length,
                columnCount: datasetWithTypes.headers.length,
              }
            : null
        }
      />

      <PrivacyNotice
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onOpenSettings={() => {
          setShowPrivacy(false)
          setShowSettings(true)
        }}
      />

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        onOpenPrivacy={() => {
          setShowHelp(false)
          setShowPrivacy(true)
        }}
      />

      <ToastContainer />
    </>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
