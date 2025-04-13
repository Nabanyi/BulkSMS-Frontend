import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { UserContextProvider } from './UserContext';
import { OpenRoute } from './OpenRoute';
import { PrivateRoute } from './PrivateRoute';
import { NoPage } from './pages/NoPage';
import {Account} from './pages/Profile';
import Layout from './components/Layout';


function App() {
  return (
    <Router>

      <UserContextProvider>
        <Routes>
          <Route path="/login" element={
            <OpenRoute>
              <Login />
            </OpenRoute>
            } 
          />

          <Route path="/" element={
            <PrivateRoute>
              <Layout currentPage='home'>
                <Home />
              </Layout>
            </PrivateRoute>
            } 
          />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Layout currentPage='home'>
                  <Home />
                </Layout>
              </PrivateRoute>
            }
          />
          
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Layout currentPage="account">
                  <Account />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <NoPage />
            }
          />
        </Routes>
      </UserContextProvider>
    </Router>
  )
}

export default App
