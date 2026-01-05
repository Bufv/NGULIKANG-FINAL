import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));





// render - account pages
const AccountUser = Loadable(lazy(() => import('pages/account/AccountUser')));
const AkunTukang = Loadable(lazy(() => import('pages/account/AkunTukang')));

// render - chat pages
const LiveChat = Loadable(lazy(() => import('pages/chat/LiveChat')));

// render - lamaran pages
const LamaranMasuk = Loadable(lazy(() => import('pages/lamaran/LamaranMasuk')));

// render - marketplace pages
const Marketplace = Loadable(lazy(() => import('pages/marketplace/Marketplace')));

// render - finance pages
const GajiPage = Loadable(lazy(() => import('pages/finance/Gaji')));

import AuthGuard from 'utils/route-guard/AuthGuard';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'account',
      children: [
        {
          path: 'user',
          element: <AccountUser />
        },
        {
          path: 'tukang',
          element: <AkunTukang />
        }
      ]
    },
    {
      path: 'chat',
      children: [
        {
          path: 'live',
          element: <LiveChat />
        }
      ]
    },
    {
      path: 'lamaran',
      children: [
        {
          path: 'masuk',
          element: <LamaranMasuk />
        }
      ]
    },
    {
      path: 'marketplace',
      children: [
        {
          path: 'products',
          element: <Marketplace />
        }
      ]
    },
    {
      path: 'finance',
      children: [
        {
          path: 'gaji',
          element: <GajiPage />
        }
      ]
    }
  ]
};

export default MainRoutes;
