import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './lib/quick-review'
import {Theme} from "@radix-ui/themes"

createRoot(document.getElementById('root')!).render(
  <>
    <Theme appearance='dark'>
      <App />
    </Theme>
  </>,
)
