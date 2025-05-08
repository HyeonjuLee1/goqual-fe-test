import React, { useEffect, useRef } from 'react'

import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ labels, datasets }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  const chartStyles = [
    {
      borderColor: getStyle('--cui-info'),
      backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, 0.1)`,
      pointHoverBackgroundColor: getStyle('--cui-info'),
      borderWidth: 2,
      fill: true,
    },
    {
      borderColor: getStyle('--cui-success'),
      backgroundColor: 'transparent',
      pointHoverBackgroundColor: getStyle('--cui-success'),
      borderWidth: 2,
      fill: false,
    },
    {
      borderColor: getStyle('--cui-danger'),
      backgroundColor: 'transparent',
      pointHoverBackgroundColor: getStyle('--cui-danger'),
      borderWidth: 1,
      borderDash: [8, 5],
      fill: false,
    },
    {
      borderColor: 'gray',
      backgroundColor: 'transparent',
      pointHoverBackgroundColor: 'gray',
      borderWidth: 1,
      fill: false,
    },
  ]

  const styledDatasets = datasets.map((ds, idx) => ({
    ...ds,
    ...(chartStyles[idx] || chartStyles[chartStyles.length - 1]),
  }))

  const formattedLabels = labels.map((ts) =>
    new Date(ts).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  )

  // Y축 라벨. 받아오는 데이터 값에 따라 유동적으로 출력하기 위함.
  const calculateYAxisStep = (datasets) => {
    const allValues = datasets.flatMap((ds) => ds.data)
    const max = Math.max(...allValues, 1)

    const roughStep = Math.ceil(max / 8)
    const niceStep = Math.ceil(roughStep / 10) * 10 || 1

    return niceStep
  }
  const yStepSize = calculateYAxisStep(styledDatasets)

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{ labels: formattedLabels, datasets: styledDatasets }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  const ts = labels[tooltipItems[0].dataIndex]
                  return new Date(ts).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                  })
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
                autoSkip: true,
                maxTicksLimit: 10,
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              maxTicksLimit: 10,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: yStepSize,
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 0,
              hitRadius: 10,
              hoverRadius: 4,
              hoverBorderWidth: 3,
            },
          },
        }}
      />
    </>
  )
}

export default MainChart
