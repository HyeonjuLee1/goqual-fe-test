import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { useEffect, useMemo, useState } from 'react'
import axiosInst from '../../api/axios'

const DeviceStatusChart = () => {
  const [chartData, setChartData] = useState(null)
  const deviceId = 'e6d8ace0-1b87-11f0-b556-e7ea660b8ad9'
  const keys = ['wh40batt', 'baromrelin', 'soilad1', 'rainratein']

  const { startTs, endTs } = useMemo(() => {
    const end = Date.now()
    return {
      endTs: end,
      startTs: end - 1000 * 60 * 60,
    }
  }, [])

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

        const timeStamps = resData[keys[0]].map((d) => new Date(d.ts).toLocaleTimeString())

        const datasets = keys.map((key, idx) => ({
          label: key,
          data: resData[key]?.map((d) => Number(d.value)) || [],
          borderColor: `hsl(${idx * 90}, 70%, 50%)`,
          fill: false,
        }))

        setChartData({
          labels: timeStamps,
          datasets,
        })
      } catch (err) {
        console.error('그래프 데이터 조회 실패:', err)
      }
    }

    fetchData()
  }, [endTs, startTs])

  return (
    <CCard>
      <CCardHeader>기기 상태 그래프</CCardHeader>
      <CCardBody>{chartData ? <CChartLine data={chartData} /> : '로딩 중...'}</CCardBody>
    </CCard>
  )
}

export default DeviceStatusChart
