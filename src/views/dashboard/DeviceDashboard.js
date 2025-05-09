import { useEffect, useMemo, useState, useCallback } from 'react'
import { CCard, CCardBody, CCol, CRow, CSpinner } from '@coreui/react'
import axiosInst from '../../api/axios'
import MainChart from './MainChart'
import BrightnessControl from './BrightnessControl'
import { useDevice } from '../../context/DeviceContext'

const DeviceDashboard = () => {
  const { deviceId } = useDevice()
  const [chartData, setChartData] = useState(null)
  const [timeRange, setTimeRange] = useState('')
  const [loading, setLoading] = useState(false)
  const [avgIntervalSec, setAvgIntervalSec] = useState(null)

  // 그래프에 출력할 상태키 배열
  const visibleKeys = useMemo(() => ['wh40batt', 'baromrelin', 'soilad1', 'rainratein'], [])

  const { startTs, endTs } = useMemo(() => {
    const end = Date.now()
    return {
      endTs: end,
      // 요구사항 : 최근 10분간의 데이터를 시각화
      startTs: end - 10 * 60 * 1000,
    }
  }, [])

  const loadChartData = useCallback(async () => {
    setLoading(true)
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

      // 상태 키 중 Interval 값을 활용하기 위함.
      const allKeysForFetch = [...availableVisibleKeys, 'interval']

      // 3. 디바이스 key에 해당하는 value 조회
      const valuesRes = await axiosInst.get(
        `/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`,
        {
          params: {
            keys: allKeysForFetch.join(','),
            startTs,
            endTs,
          },
        },
      )
      const deviceValues = valuesRes.data

      console.log('resData', deviceValues)

      // 차트에 넣을 데이터
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

      // 평균 interval value 계산
      const intervalData = deviceValues['interval']
      if (intervalData && intervalData.length > 0) {
        const valuesOnly = intervalData.map((d) => Number(d.value))
        const avg = valuesOnly.reduce((a, b) => a + b, 0) / valuesOnly.length
        setAvgIntervalSec(avg.toFixed(1))
      }
    } catch (err) {
      const status = err.response?.status
      const msg = err.response?.data?.message

      if (status === 401 && msg === 'Token has expired') {
        alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
        localStorage.removeItem('token')
        window.location.replace('/login')
        return
      }
      console.error('그래프 데이터 조회 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [deviceId, visibleKeys, startTs, endTs])

  useEffect(() => {
    loadChartData()
  }, [loadChartData])

  // avgIntervalSec 기준으로 실시간 자동 갱신
  useEffect(() => {
    if (!avgIntervalSec || avgIntervalSec === 'N/A') return
    const intervalMs = Number(avgIntervalSec) * 1000
    const interval = setInterval(() => {
      loadChartData()
    }, intervalMs)
    return () => clearInterval(interval)
  }, [avgIntervalSec, loadChartData])

  return (
    <>
      <CCard className="mb-5">
        <CCardBody style={{ minHeight: '430px' }}>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-1">
                기기 상태 조회
              </h4>

              <div className="small text-body-secondary">최근 데이터 범위: {timeRange}</div>
              {avgIntervalSec && (
                <div className="text-muted small">
                  ⏱ 평균 갱신 간격:{' '}
                  {avgIntervalSec !== 'N/A' ? `${avgIntervalSec}초` : '정보 없음'}
                </div>
              )}
            </CCol>
          </CRow>
          {loading ? (
            <div className="text-center py-4">
              <CSpinner color="primary" />
            </div>
          ) : chartData ? (
            <MainChart labels={chartData.labels} datasets={chartData.datasets} />
          ) : (
            <div className="text-center py-4">
              <div className="mb-2">데이터가 없습니다.</div>
            </div>
          )}
        </CCardBody>
      </CCard>
      <BrightnessControl />
    </>
  )
}

export default DeviceDashboard
