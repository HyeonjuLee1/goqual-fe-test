import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import { useEffect, useMemo, useState } from 'react'
import axiosInst from '../../api/axios'
import MainChart from './MainChart'
import BrightnessControl from './BrightnessControl'

const DeviceDashboard = () => {
  const [chartData, setChartData] = useState(null)
  const deviceId = 'e6d8ace0-1b87-11f0-b556-e7ea660b8ad9'
  const [timeRange, setTimeRange] = useState('')
  // 그래프에 출력할 상태키 배열
  const visibleKeys = useMemo(() => ['wh40batt', 'baromrelin', 'soilad1', 'rainratein'], [])

  const { startTs, endTs } = useMemo(() => {
    const end = Date.now()
    return {
      endTs: end,
      startTs: end - 10 * 60 * 1000,
    }
  }, [])

  useEffect(() => {
    const loadChartData = async () => {
      try {
        // 1. 디바이스 key 조회
        const keysRes = await axiosInst.get(
          `/api/plugins/telemetry/DEVICE/${deviceId}/keys/timeseries`,
        )
        const keys = keysRes.data
        console.log('keys', keys)

        // 2. 요구사항 상태키와 교집합 추출 / 없다면 경고
        const availableVisibleKeys = visibleKeys.filter((key) => keys.includes(key))

        if (availableVisibleKeys.length === 0) {
          console.warn('해당 디바이스는 지정된 키를 가지고 있지 않습니다.')
          return
        }

        // 3. 디바이스 key에 해당하는 value 조회
        const valuesRes = await axiosInst.get(
          `/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`,
          {
            params: {
              keys: availableVisibleKeys.join(','),
              startTs,
              endTs,
            },
          },
        )
        const deviceValues = valuesRes.data

        console.log('resData', deviceValues)

        const timeStamps = deviceValues[availableVisibleKeys[0]]?.map((d) => d.ts) || []

        const reverseTimeStamps = timeStamps.reverse()

        const startLabel = new Date(reverseTimeStamps[0]).toLocaleTimeString()
        const endLabel = new Date(
          reverseTimeStamps[reverseTimeStamps.length - 1],
        ).toLocaleTimeString()

        setTimeRange(`${startLabel} ~ ${endLabel}`)

        const datasets = availableVisibleKeys.map((key, idx) => ({
          label: key,
          data: (deviceValues[key]?.map((d) => Number(d.value)) || []).reverse(),
          backgroundColor: 'transparent',
          borderColor: `hsl(${idx * 90}, 70%, 50%)`,
          pointHoverBackgroundColor: `hsl(${idx * 90}, 70%, 50%)`,
          borderWidth: 2,
        }))

        setChartData({ labels: reverseTimeStamps, datasets })
      } catch (err) {
        console.error('그래프 데이터 조회 실패:', err)
      }
    }

    loadChartData()
  }, [visibleKeys, endTs, startTs])

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-1">
                기기 상태 조회
              </h4>
              <div className="small text-body-secondary">최근 데이터 범위: {timeRange}</div>
            </CCol>
          </CRow>
          {chartData && <MainChart labels={chartData.labels} datasets={chartData.datasets} />}
        </CCardBody>
      </CCard>
      <BrightnessControl />
    </>
  )
}

export default DeviceDashboard
