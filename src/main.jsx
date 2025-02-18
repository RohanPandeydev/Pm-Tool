import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './utils/Toast/toastmessage.css'
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import  { ContextWrapper } from './contexts/Context.jsx';
import { ToastProvider } from './utils/Toast/ToastMessage.jsx'
import DisableInspect from './utils/DisableInspect.jsx'
import 'react-lazy-load-image-component/src/effects/blur.css';


const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
{/* <DisableInspect/> */}
      <BrowserRouter>
      <ToastContainer/>
      <ToastProvider>
        <ContextWrapper>
          <App />
        </ContextWrapper>
      </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
)
