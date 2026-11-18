import { Logo } from '@/components/common/Logo';
import { LANDING_NAV_LINKS } from '@/lib/constants/landing';

export function LandingFooter() {
    return (
        <footer className="bg-navy text-slate-300">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
                <Logo variant="light" />
                <nav aria-label="Footer" className="flex flex-wrap justify-center gap-6 text-sm font-semibold">
                    {LANDING_NAV_LINKS.map((link) => (
                        <a key={link.id} href={`#${link.id}`} className="transition hover:text-white">
                            {link.label}
                        </a>
                    ))}
                </nav>
                <p className="text-sm">{`© ${new Date().getFullYear()} VigilantGear. All rights reserved.`}</p>
            </div>
        </footer>
    );
}