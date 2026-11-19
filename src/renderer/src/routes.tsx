import { Route } from 'react-router-dom'
//routes
import LoginPage from './pages/Login'
import Home from './pages/Home'
import Accounts, { loader as getAccounts } from './pages/Accounts'
import AccountSingle, { loader as getAccount } from './pages/Accounts.id'
import Concessioners, { loader as getConcessioners } from './pages/Concessioners'
import ConcessionerSingle, { loader as getConcessioner } from './pages/Concessioner.id'
import Readings, { loader as getReadings } from './pages/Readings'
import ReadingSingle, { loader as getReading } from './pages/Readings.id'
import Billing, { loader as getBillings } from './pages/Billing'
import Payment, { loader as getPayments } from './pages/Payment'
import PageNotFound from './pages/not-found'
import { Router } from '@lib/electron-router-dom'
import RootErrorBoundary from './components/error-boundary'
import InterFont from './assets/Inter.ttf'
import BillingSingle, { loader as getBilling } from './pages/Billing.id'
import { SkeletonShimmer } from './components/skeleton-content'

const font = new FontFace('Inter', `url(${InterFont})`)
font
  .load()
  .then((loadedFont) => {
    document.fonts.add(loadedFont)
    document.body.style.fontFamily = "'Inter', sans-serif"
  })
  .catch((err) => {
    console.error('Font failed to load:', err)
  })

export default function AppRouterManager() {
  return (
    <Router
      main={
        <>
          <Route errorElement={<RootErrorBoundary />}>
            <Route index element={<Home />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route
              path="/accounts"
              element={<Accounts />}
              loader={getAccounts}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route
              path="/account/:id"
              element={<AccountSingle />}
              loader={getAccount}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route
              path="/concessioners"
              element={<Concessioners />}
              loader={getConcessioners}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route
              path="/concessioner/:id"
              element={<ConcessionerSingle />}
              loader={getConcessioner}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route
              path="/readings"
              element={<Readings />}
              loader={getReadings}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route
              path="/reading/:id"
              element={<ReadingSingle />}
              loader={getReading}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route
              path="/payments"
              element={<Payment />}
              loader={getPayments}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route
              path="/billings"
              element={<Billing />}
              loader={getBillings}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route
              path="/billing/:id"
              element={<BillingSingle />}
              loader={getBilling}
              hydrateFallbackElement={<SkeletonShimmer type="table" />}
            />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </>
      }
    />
  )
}
