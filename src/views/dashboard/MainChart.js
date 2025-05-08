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
  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{ labels, datasets: styledDatasets }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
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
              max: 250,
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 5,
                stepSize: Math.ceil(250 / 5),
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
