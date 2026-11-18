import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/lib/constants/routes';

export function AboutSection() {
    return (
        <section id="about" className="scroll-mt-20 bg-canvas py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">About VigilantGear</h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg text-ink-muted">
                        VigilantGear is an AI-powered workplace safety platform for safety managers. It is designed to detect
                        workers and their supported PPE, flag possible violations, and keep a searchable history for reports and
                        audits.
                    </p>
                </div>

                <div className="mt-12 rounded-3xl bg-gradient-to-r from-navy to-navy-deep p-8 text-center text-white sm:p-12">
                    <h3 className="text-2xl font-extrabold sm:text-3xl">Ready to see it in action?</h3>
                    <p className="mx-auto mt-3 max-w-xl text-slate-300">
                        Create an account or sign in with the demo credentials to explore the full interface.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <Button as={Link} to={ROUTES.signup} size="lg">
                            Get Started
                            <ArrowRight className="h-5 w-5" aria-hidden="true" />
                        </Button>
                        <Button as={Link} to={ROUTES.login} variant="outline" size="lg">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}