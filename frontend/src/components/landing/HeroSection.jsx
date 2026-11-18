import { ArrowRight, Check, Cpu, Minus, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { SafeImage } from '@/components/common/SafeImage';
import { HERO_PPE_STATUS } from '@/lib/constants/landing';
import { IMAGES } from '@/lib/constants/images';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils/cn';

export function HeroSection() {
    return (
        <section
            id="home"
            className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-navy via-navy-deep to-navy pb-28 pt-14 text-white lg:pt-20"
        >
            <svg
                className="pointer-events-none absolute inset-y-0 left-[38%] hidden h-full w-40 lg:block"
                viewBox="0 0 200 600"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d="M190 0 C 120 200, 60 400, 0 600" fill="none" stroke="#FF6900" strokeWidth="6" />
            </svg>

            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                        <Cpu className="h-4 w-4 text-brand" aria-hidden="true" />
                        AI-Powered Safety Monitoring
                    </span>

                    <h1 className="mt-6">
                        <span className="block text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
                            Vigilant<span className="text-brand">Gear</span>
                        </span>
                        <span className="mt-3 block text-3xl font-extrabold leading-tight sm:text-4xl">
                            AI-Powered PPE Compliance Monitoring
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg text-slate-300">
                        Detect, analyze and prevent PPE violations in real time with computer vision. Keep your workplace safer,
                        compliant and smarter.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button as={Link} to={ROUTES.signup} size="lg">
                            Get Started
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </Button>
                        <Button as="a" href="#how-it-works" variant="outline" size="lg" icon={Play}>
                            Watch Demo
                        </Button>
                    </div>
                </div>

                <div className="relative mx-auto h-[420px] w-full max-w-xl lg:h-[480px]">
                    <SafeImage
                        src={IMAGES.heroWorker}
                        alt="Construction worker wearing a helmet and safety vest"
                        loading="eager"
                        className="absolute inset-0 h-full w-full rounded-3xl object-cover object-top shadow-2xl"
                    />
                    <div className="absolute left-[24%] top-[14%] h-[58%] w-[34%] rounded-md border-2 border-green-500">
                        <span className="absolute -top-8 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-lg bg-green-500 px-3 py-1 text-sm font-bold">
                            Compliant
                            <Check className="h-4 w-4" aria-hidden="true" />
                        </span>
                    </div>

                    <ul className="absolute bottom-6 right-3 w-56 space-y-2 rounded-2xl border border-white/20 bg-navy/70 p-3 backdrop-blur sm:right-0">
                        {HERO_PPE_STATUS.map(({ id, label, detected, icon: Icon }) => (
                            <li key={id} className="flex items-center gap-2 text-sm font-semibold">
                                <span
                                    className={cn(
                                        'flex h-7 w-7 items-center justify-center rounded-lg',
                                        detected ? 'bg-green-500' : 'bg-slate-500',
                                    )}
                                >
                                    <Icon className="h-4 w-4" aria-hidden="true" />
                                </span>
                                <span className="flex-1">{label}</span>
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-1 text-xs',
                                        detected ? 'text-green-400' : 'text-slate-300',
                                    )}
                                >
                                    {detected ? (
                                        <Check className="h-3 w-3" aria-hidden="true" />
                                    ) : (
                                        <Minus className="h-3 w-3" aria-hidden="true" />
                                    )}
                                    {detected ? 'Detected' : 'Not Trained'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <svg
                className="absolute bottom-0 left-0 h-16 w-full"
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <path d="M0 80 L0 40 Q720 -30 1440 40 L1440 80 Z" fill="#FFFFFF" />
            </svg>
        </section>
    );
}