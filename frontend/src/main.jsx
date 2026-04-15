import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// SweetAlert2 styles
import 'sweetalert2/dist/sweetalert2.min.css';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
