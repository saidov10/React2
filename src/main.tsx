import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { reduxStore } from './store/reduxStore'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider store={reduxStore}>
      <App />
    </ReduxProvider>
  </StrictMode>,
)
