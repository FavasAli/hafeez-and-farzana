import {createRoot} from 'react-dom/client'
import App from './App'
import './styles.css'
import './theme-light.css' // light theme; remove this line for the dark theme
createRoot(document.getElementById('root')).render(<App/>)