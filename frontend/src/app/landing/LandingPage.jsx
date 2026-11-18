import { AboutSection } from '@/components/landing/AboutSection';
import { FeatureStrip } from '@/components/landing/FeatureStrip';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { KeyFeatures } from '@/components/landing/KeyFeatures';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { TechnologySection } from '@/components/landing/TechnologySection';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function LandingPage() {
    useDocumentTitle();

    return (
        <div className="bg-white">
            <LandingNavbar />
            <main>
                <HeroSection />
                <FeatureStrip />
                <KeyFeatures />
                <HowItWorks />
                <TechnologySection />
                <AboutSection />
            </main>
            <LandingFooter />
        </div>
    );
}