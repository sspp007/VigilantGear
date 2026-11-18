import { Route, Routes } from 'react-router-dom';
import { DashboardPage } from '@/app/dashboard/DashboardPage';
import { DetectionResultsPage } from '@/app/detection-results/DetectionResultsPage';
import { LandingPage } from '@/app/landing/LandingPage';
import { LiveDetectionPage } from '@/app/live-detection/LiveDetectionPage';
import { LoginPage } from '@/app/login/LoginPage';
import { NotFoundPage } from '@/app/not-found/NotFoundPage';
import { ReportsPage } from '@/app/reports/ReportsPage';
import { SettingsPage } from '@/app/settings/SettingsPage';
import { SignupPage } from '@/app/signup/SignupPage';
import { VideoAnalysisPage } from '@/app/video-analysis/VideoAnalysisPage';
import { ViolationHistoryPage } from '@/app/violation-history/ViolationHistoryPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { GuestRoute } from '@/components/layout/GuestRoute';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ROUTES } from '@/lib/constants/routes';

export function App() {
  return (
    <Routes>
      <Route path={ROUTES.landing} element={<LandingPage />} />

      <Route element={<GuestRoute />}>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.signup} element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardPage />} />
          <Route path={ROUTES.liveDetection} element={<LiveDetectionPage />} />
          <Route path={ROUTES.videoAnalysis} element={<VideoAnalysisPage />} />
          <Route path={ROUTES.detectionResults} element={<DetectionResultsPage />} />
          <Route path={ROUTES.violationHistory} element={<ViolationHistoryPage />} />
          <Route path={ROUTES.reports} element={<ReportsPage />} />
          <Route path={ROUTES.settings} element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}