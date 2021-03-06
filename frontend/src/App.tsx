import './App.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Routes } from './routes'
import { ReactQueryDevtools } from 'react-query-devtools'
import { BrowserRouter as Router } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { Suspense } from 'react'
import i18next from './constant/i18n'
import './initialize'
import { withCtx } from './utils/helper'
import { AppCtx } from './constant/contexts'
import { AppSnackbar } from './components/AppSnackbar'
const queryClient = new QueryClient()

const App = () => {
  return (
    <I18nextProvider i18n={i18next}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<div>...loading</div>}>
            <AppSnackbar />
            <Routes />
          </Suspense>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </I18nextProvider>
  )
}

export default withCtx(AppCtx)(App)
