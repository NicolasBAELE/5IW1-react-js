import { useState } from 'react'
import './App.css'
import { RegisterBox } from './components/RegisterBox'
import { LoginBox } from './components/LoginBox'
import { useUser } from './contexts/UserContext'
import { Match } from './components/Match'

function App() {
  const [registerMode, setRegisterMode] = useState(true)
  const [joinMatchError, setJoinMatchError] = useState("")
  const [matchId, setMatchId] = useState(null)
  const { token, matches, logout, joinMatch } = useUser();


  return (
    <>
      {!token && registerMode && <RegisterBox />}
      {!token && !registerMode && <LoginBox />}
      {!token && <button onClick={() => setRegisterMode(!registerMode)}>{registerMode ? "Se connecter" : "S'inscrire"}</button>}
      {matches.length > 0 && <>
        <div>Matchs</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Joueur 1 - ID</th>
              <th>Joueur 1</th>
              <th>Joueur 2 - ID</th>
              <th>Joueur 2</th>
              <th>Tours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match =>
              <>
                <tr>
                  <td>{match._id}</td>
                  <td>{match.user1?._id}</td>
                  <td>{match.user1?.username}</td>
                  <td>{match.user2?._id}</td>
                  <td>{match.user2?.username}</td>
                  <td>{match.turns}</td>
                  <td><button onClick={() => setMatchId(match._id)}>Voir les logs</button></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </>}
      {token && <button onClick={() => logout()}>Se déconnecter</button>}
      {token && <button onClick={() => joinMatch(setJoinMatchError)}>Rejoindre un match</button>}
      {matchId && <button onClick={() => setMatchId(null)}>Ne plus afficher les logs de {matchId}</button>}
      {joinMatchError}

      {matchId && <Match matchId={matchId} />}
    </>
  )
}

export default App
