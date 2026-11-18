import {
    BarChart3,
    Camera,
    ClipboardList,
    History,
    Home,
    PlaySquare,
    Settings,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';

export const NAV_ITEMS = [
    { label: 'Dashboard', to: ROUTES.dashboard, icon: Home },
    { label: 'Live Detection', to: ROUTES.liveDetection, icon: Camera },
    { label: 'Video Analysis', to: ROUTES.videoAnalysis, icon: PlaySquare },
    { label: 'Detection Results', to: ROUTES.detectionResults, icon: ClipboardList },
    { label: 'Violation History', to: ROUTES.violationHistory, icon: History },
    { label: 'Reports', to: ROUTES.reports, icon: BarChart3 },
    { label: 'Settings', to: ROUTES.settings, icon: Settings },
];