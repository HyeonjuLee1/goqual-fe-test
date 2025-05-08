import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { useEffect, useState } from 'react'
import axiosInst from '../../api/axios'

const DeviceStatusChart = () => {
  const [chartData, setChartData] = useState(null)
  const deviceId = 'e6d8ace0-1b87-11f0-b556-e7ea660b8ad9'
  const keys = ['wh40batt', 'baromrelin', 'soilad1', 'rainratein']
  const endTs = Date.now()
  const startTs = endTs - 1000 * 60 * 60 // 1시간 전

  useEffect(() => {
    const fetchData = async () => {
      try {
        const keysRes = await axiosInst.get(
          `/api/plugins/telemetry/DEVICE/${deviceId}/keys/timeseries`,
        )
        const keys = keysRes.data
        console.log('keys', keys)

        const valuesRes = await axiosInst.get(
          `/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`,
          {
            params: {
              keys: keys.join(','),
              startTs,
              endTs,
            },
          },
        )

        const resData = valuesRes.data
        console.log('resData', resData)
      } catch (err) {
        console.error('그래프 데이터 조회 실패:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <CCard>
      <CCardHeader>기기 상태 그래프</CCardHeader>
      <CCardBody>{chartData ? <CChartLine data={chartData} /> : '로딩 중...'}</CCardBody>
    </CCard>
  )
}

export default DeviceStatusChart
