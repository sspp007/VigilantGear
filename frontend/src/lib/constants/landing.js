import {
    BarChart3,
    ClipboardCheck,
    Cpu,
    FileText,
    Glasses,
    Hand,
    HardHat,
    History,
    ShieldCheck,
    Shirt,
    SlidersHorizontal,
    Upload,
    Video,
    Webcam,
} from 'lucide-react';

export const LANDING_NAV_LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'technology', label: 'Technology' },
    { id: 'about', label: 'About' },
];

export const LANDING_SECTION_IDS = LANDING_NAV_LINKS.map((link) => link.id);

export const HERO_PPE_STATUS = [
    { id: 'helmet', label: 'Helmet', detected: true, icon: HardHat },
    { id: 'safety_vest', label: 'Safety Vest', detected: true, icon: Shirt },
    { id: 'gloves', label: 'Gloves', detected: false, icon: Hand },
    { id: 'goggles', label: 'Goggles', detected: true, icon: Glasses },
];

export const FEATURE_STRIP = [
    {
        icon: Webcam,
        title: 'Live Detection',
        description: 'Real-time PPE monitoring using webcam',
        tile: 'bg-violet-100 text-violet-600',
    },
    {
        icon: Video,
        title: 'Video Analysis',
        description: 'Upload and analyze workplace videos',
        tile: 'bg-orange-100 text-brand',
    },
    {
        icon: BarChart3,
        title: 'Compliance Insights',
        description: 'Track violations, trends and safety performance',
        tile: 'bg-blue-100 text-blue-600',
    },
    {
        icon: ShieldCheck,
        title: 'Violation History',
        description: 'Search, review and export detection records',
        tile: 'bg-green-100 text-green-600',
    },
];

export const KEY_FEATURES = [
    {
        icon: Webcam,
        title: 'Live Webcam Detection',
        description: 'Monitor people and PPE in real time with clear compliant, violation and uncertain indicators.',
    },
    {
        icon: Video,
        title: 'Video Analysis',
        description: 'Upload workplace footage, follow processing progress and review annotated results.',
    },
    {
        icon: BarChart3,
        title: 'Compliance Dashboard',
        description: 'See compliance rates, trends and violation categories at a glance.',
    },
    {
        icon: History,
        title: 'Violation History',
        description: 'Search, filter and review every recorded violation with its snapshot and source.',
    },
    {
        icon: FileText,
        title: 'Reports and Exports',
        description: 'Generate compliance summaries and export detection data for audits.',
    },
    {
        icon: SlidersHorizontal,
        title: 'Configurable Settings',
        description: 'Choose which PPE to detect and tune confidence thresholds for your site.',
    },
];

export const HOW_IT_WORKS_STEPS = [
    {
        icon: Upload,
        title: 'Connect a source',
        description: 'Upload a workplace video or start your webcam.',
    },
    {
        icon: Cpu,
        title: 'Detect PPE',
        description: 'Computer vision finds workers and supported PPE. In this demo the detection is simulated.',
    },
    {
        icon: ClipboardCheck,
        title: 'Review results',
        description: 'Check annotated frames, statuses and confidence for every person.',
    },
    {
        icon: FileText,
        title: 'Act and report',
        description: 'Follow up on violations and export reports for your safety team.',
    },
];

export const TECHNOLOGY_STACK = [
    { name: 'React + Vite', description: 'Fast, responsive single-page frontend.', isCurrent: true },
    { name: 'Tailwind CSS', description: 'Consistent design system and responsive layouts.', isCurrent: true },
    { name: 'Recharts', description: 'Interactive compliance and violation charts.', isCurrent: true },
    { name: 'Node.js + Express', description: 'REST API, authentication and video upload handling.', isCurrent: false },
    { name: 'MongoDB', description: 'Users, analysis jobs, detection events and settings.', isCurrent: false },
    { name: 'FastAPI + YOLO', description: 'PPE detection with Ultralytics YOLO, OpenCV and FFmpeg.', isCurrent: false },
];