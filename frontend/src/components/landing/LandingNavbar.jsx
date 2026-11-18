import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { IconButton } from '@/components/common/IconButton';
import { Logo } from '@/components/common/Logo';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useAuth } from '@/hooks/useAuth';
import { LANDING_NAV_LINKS, LANDING_SECTION_IDS } from '@/lib/constants/landing';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

export function LandingNavbar() {
    const { isAuthenticated } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const activeId = useActiveSection(LANDING_SECTION_IDS);

    const actions = isAuthenticated ? (
        <Button as={Link} to={ROUTES.dashboard} size="sm">
            Go to Dashboard
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
    ) : (
        <>
            <Button as={Link} to={ROUTES.login} variant="outline" size="sm">
                Login
            </Button>
            <Button as={Link} to={ROUTES.signup} size="sm">
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
        </>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 text-white backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <a href="#home" aria-label="VigilantGear home">
                    <Logo variant="light" />
                </a>

                <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
                    {LANDING_NAV_LINKS.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            aria-current={activeId === link.id ? 'true' : undefined}
                            className={cn(
                                'border-b-2 py-5 text-sm font-semibold transition',
                                activeId === link.id
                                    ? 'border-brand text-white'
                                    : 'border-transparent text-slate-300 hover:text-white',
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 lg:flex">{actions}</div>

                <IconButton
                    icon={isMenuOpen ? X : Menu}
                    label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    variant="dark"
                    className="lg:hidden"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
            </div>

            {isMenuOpen && (
                <div className="border-t border-white/10 px-4 pb-4 lg:hidden">
                    <nav aria-label="Mobile" className="flex flex-col py-2">
                        {LANDING_NAV_LINKS.map((link) => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="rounded-lg px-2 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <div className="flex gap-3">{actions}</div>
                </div>
            )}
        </header>
    );
}