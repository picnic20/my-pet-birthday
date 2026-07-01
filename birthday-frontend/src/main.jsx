// src/main.jsx 예시
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // 💡 App.jsx를 올바르게 가져오고 있는지 확인!
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)