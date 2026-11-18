import { Logo } from '@/components/common/Logo';
import { SafeImage } from '@/components/common/SafeImage';
import { cn } from '@/lib/utils/cn';

export function AuthShell({
    image,
    badgeIcon: BadgeIcon,
    badgeLabel,
    headingLead,
    leadOnOwnLine = false,
    description,
    features,
    children,
}) {
    return (
        <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
            <section className="relative hidden overflow-hidden bg-navy text-white lg:block">
                <SafeImage
                    src={image}
                    alt="Construction worker wearing PPE at a building site"
                    loading="eager"
                    className="absolute inset-0 h-full w-full object-cover object-right"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/10" aria-hidden="true" />

                <div className="relative z-10 flex h-full flex-col px-12 py-10 xl:px-20">
                    <Logo variant="light" size="lg" />

                    <div className="my-auto max-w-lg py-10">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold">
                            <BadgeIcon className="h-4 w-4 text-brand" aria-hidden="true" />
                            {badgeLabel}
                        </span>
                        <h1 className="mt-6 text-5xl font-extrabold leading-tight xl:text-6xl">
                            {headingLead}
                            {leadOnOwnLine ? <br /> : ' '}
                            Vigilant<span className="text-brand">Gear</span>
                        </h1>
                        <p className="mt-5 max-w-md text-lg text-slate-200">{description}</p>

                        <ul className="mt-8 space-y-4">
                            {features.map(({ icon: Icon, label, tile }) => (
                                <li key={label} className="flex items-center gap-4 text-base font-semibold">
                                    <span className={cn('flex h-12 w-12 items-center justify-center rounded-xl text-white', tile)}>
                                        <Icon className="h-6 w-6" aria-hidden="true" />
                                    </span>
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <svg
                    className="pointer-events-none absolute bottom-0 left-0 h-32 w-full"
                    viewBox="0 0 800 160"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path d="M0 100 C 200 30, 420 50, 800 130 L800 160 L0 160 Z" fill="#FF6900" />
                </svg>
            </section>

            <section className="flex items-center justify-center bg-gradient-to-br from-white via-orange-50/60 to-pink-100 px-4 py-10 sm:px-8">
                <div className="w-full max-w-md">
                    <div className="mb-6 flex justify-center lg:hidden">
                        <Logo size="lg" />
                    </div>
                    <div className="card rounded-3xl p-6 sm:p-8">{children}</div>
                </div>
            </section>
        </div>
    );
}