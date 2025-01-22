import { useState } from 'react'
import './App.css'
import { RegisterBox } from './components/RegisterBox'
import { LoginBox } from './components/LoginBox'

function App() {
  const [registerMode, setRegisterMode] = useState(true)

  return (
    <>
      {registerMode && <RegisterBox />}
      {!registerMode && <LoginBox />}
      <button onClick={() => setRegisterMode(!registerMode)}>{registerMode ? "Se connecter" : "S'inscrire"}</button>
    </>
  )
}

export default App
