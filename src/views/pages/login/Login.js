import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axiosInst from '../../../api/axios'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!username || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.')
      setLoading(false)
      return
    }

    try {
      const res = await axiosInst.post('/api/auth/login', {
        username,
        password,
      })
      const { token } = res.data
      console.log('token', token)
      if (token) {
        localStorage.setItem('token', token)
        window.location.replace('/')
      } else {
        throw new Error('토큰이 응답에 없습니다.')
      }
    } catch (err) {
      const msg = err.response?.data?.message
      if (msg === 'Invalid username or password' || msg === 'Authentication failed') {
        setError('아이디 또는 비밀번호를 확인하세요.')
      } else {
        setError('로그인 중 문제가 발생했습니다.')
      }
      console.log('로그인 에러:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4 align-items-center">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        id="username"
                        name="username"
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        invalid={error}
                      />
                    </CInputGroup>

                    <CInputGroup className={error ? 'mb-1' : 'mb-4'}>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        invalid={error}
                      />
                    </CInputGroup>
                    {error && (
                      <p className="text-danger small" style={{ fontSize: '12px' }}>
                        {error}
                      </p>
                    )}
                    <CRow>
                      <CCol>
                        <CButton type="submit" color="primary" className="px-4 w-100">
                          {loading ? <CSpinner size="sm" color="light" /> : 'Login'}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
