import { cn } from '@/lib/utils/cn';

/** Local, API-free artwork used wherever the demo has no source footage. */
export function SafetyVisual({ variant = 'snapshot', className, label = 'Construction site safety monitoring illustration' }) {
    const isHero = variant === 'hero' || variant === 'auth';
    const isLive = variant === 'live';
    const sky = variant === 'snapshot' ? '#dce8ed' : '#e7edf1';

    return (
        <div role="img" aria-label={label} className={cn('relative overflow-hidden bg-[#e7edf1]', className)}>
            <svg viewBox="0 0 720 480" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                    <linearGradient id={`sky-${variant}`} x2="0" y2="1"><stop stopColor={sky}/><stop offset="1" stopColor="#c7d4d9"/></linearGradient>
                    <linearGradient id={`vest-${variant}`} x2="1" y2="1"><stop stopColor="#ff8a1c"/><stop offset="1" stopColor="#e85e00"/></linearGradient>
                    <pattern id={`grid-${variant}`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#fff" strokeOpacity=".2"/></pattern>
                </defs>
                <rect width="720" height="480" fill={`url(#sky-${variant})`}/>
                <path d="M0 314 140 198h128l80 84 109-130 90 111 88-62 85 70v128H0Z" fill="#9cabb0" opacity=".66"/>
                <path d="M0 363 110 292h180l75 45 103-80 110 52 75-44 67 46v169H0Z" fill="#718087" opacity=".72"/>
                <path d="M0 385h720v95H0Z" fill="#35444b"/>
                <path d="M0 419h720" stroke="#f5a623" strokeWidth="5" strokeDasharray="26 18" opacity=".8"/>
                <g opacity=".86" fill="none" stroke="#f6f8f9" strokeWidth="8">
                    <path d="M80 277V93h180v184M65 147h211M65 209h211M170 94v184M420 285V77h145v208M405 144h175M405 213h175M493 78v207"/>
                    <path d="m82 98 175 177M257 98 82 275M422 82l140 201M562 82 422 283" opacity=".52"/>
                </g>
                <g transform="translate(306 139)">
                    <path d="M39 70c0-29 19-50 48-50s48 21 48 50v20H39Z" fill="#ffb000" stroke="#fff" strokeWidth="5"/>
                    <path d="M31 81h112v14H31z" rx="5" fill="#e89000" stroke="#fff" strokeWidth="4"/>
                    <path d="M55 96h65l23 31 22 131H13l20-131Z" fill="#233746"/>
                    <path d="m54 98 33 14 32-14 18 31-17 17 11 117H45l11-117-18-17Z" fill={`url(#vest-${variant})`} stroke="#fff" strokeWidth="4"/>
                    <path d="M77 111h20l-5 147H82Z" fill="#f8fafc" opacity=".92"/>
                    <path d="m47 127-30 61 18 13 37-54M127 127l31 61-18 13-37-54" fill="#233746" stroke="#fff" strokeWidth="3"/>
                    <path d="M41 256 31 318h35l14-62m18 0 16 62h35l-11-62" fill="#35444b"/>
                    <path d="M21 314h48v14H14zm84 0h49v14h-46z" fill="#182a37"/>
                    <path d="M48 158h78" stroke="#fff" strokeWidth="5" opacity=".9"/>
                    <rect x="60" y="85" width="62" height="42" rx="4" fill="none" stroke="#38d99a" strokeWidth="3"/>
                    <rect x="57" y="67" width="97" height="20" rx="4" fill="#107c5b"/>
                    <text x="64" y="81" fill="#fff" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="700">HELMET 98%</text>
                    <rect x="8" y="120" width="156" height="140" rx="5" fill="none" stroke="#38d99a" strokeWidth="3" strokeDasharray="9 4"/>
                    <rect x="8" y="260" width="118" height="20" rx="4" fill="#107c5b"/>
                    <text x="15" y="274" fill="#fff" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="700">WORKER 96.4%</text>
                </g>
                {isHero && <g><rect width="720" height="480" fill={`url(#grid-${variant})`}/><path d="M20 230H700" stroke="#3bd6a1" strokeWidth="2" strokeOpacity=".42"/><path d="M0 221H720" stroke="#3bd6a1" strokeWidth="1" opacity=".3"/><rect x="24" y="24" width="142" height="30" rx="15" fill="#102532" opacity=".88"/><circle cx="43" cy="39" r="5" fill="#38d99a"/><text x="57" y="44" fill="white" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700">AI ANALYSIS ACTIVE</text></g>}
                {isLive && <g><rect x="18" y="18" width="82" height="27" rx="6" fill="#b91c1c"/><circle cx="32" cy="31" r="4" fill="white"/><text x="43" y="35" fill="white" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700">CAM 01</text><path d="M0 240H720" stroke="#37deb2" strokeWidth="3" opacity=".5"/></g>}
                {variant === 'video' && <g><circle cx="360" cy="240" r="34" fill="#102532" fillOpacity=".78"/><path d="m351 222 27 18-27 18Z" fill="white"/></g>}
            </svg>
        </div>
    );
}
