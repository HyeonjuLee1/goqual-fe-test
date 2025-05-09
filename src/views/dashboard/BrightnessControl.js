import React, { useCallback, useEffect, useState } from 'react'
import { CCard, CCardBody, CFormRange } from '@coreui/react'
import axiosInst from '../../api/axios'
import './BrightnessControl.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'

const BrightnessControl = () => {
  const [brightness, setBrightness] = useState(60)

  const deviceId = 'e6d8ace0-1b87-11f0-b556-e7ea660b8ad9'
  const bulbOpacity = Math.max(brightness / 100, 0.1)

  const handleBrightnessChange = useCallback(
    async (e) => {
      const newValue = Number(e.target.value)
      setBrightness(newValue)

      try {
        await axiosInst.post(`api/plugins/telemetry/DEVICE/${deviceId}/SERVER_SCOPE`, {
          attributes: {
            brightness: newValue,
          },
        })
        console.log('밝기 조절 성공:', newValue)
      } catch (err) {
        console.error('밝기 제어 실패:', err)
      }
    },
    [deviceId],
  )

  // 밝기 비율에 따른 슬라이더 배경
  const background = `linear-gradient(to right, #eeeeee ${brightness}%, #111111 ${brightness}%)`

  return (
    <div style={{ width: '300px' }}>
      <CCard className="p-3 text-white bg-dark">
        <div className="d-flex justify-content-between mb-3 px-2">
          <div className="fw-semibold pb-1">전구</div>
        </div>

        <CCardBody className="text-center">
          <div className="text-center my-3">
            <FontAwesomeIcon
              icon={faLightbulb}
              size="4x"
              style={{ color: `rgba(255, 255, 255, ${bulbOpacity})`, transition: 'color 0.3s' }}
            />
          </div>

          <input
            type="range"
            className="brightness-slider"
            min="0"
            max="100"
            value={brightness}
            onChange={handleBrightnessChange}
            style={{
              '--progress': `${brightness}%`,
              '--bg-end': '#2d2f36',
            }}
          />
          <div className="mt-2 small">밝기: {brightness}%</div>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default BrightnessControl
