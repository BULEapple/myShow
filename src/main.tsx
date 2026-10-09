// 应用入口
import React from 'react'
import ReactDOM from 'react-dom/client'
import './lib/polyfills'
import App from './App'
import 'highlight.js/styles/github-dark.css'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
