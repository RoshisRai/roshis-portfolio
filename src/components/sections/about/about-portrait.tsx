import Image from "next/image"

export const AboutPortrait = () => {
    return (
        <div className="about-animate relative w-full lg:w-auto shrink-0">
            <div className="relative w-full max-w-100 mx-auto lg:mx-0">
                
                <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-indigo-500/10">
                    <Image
                        src="/images/portrait.png"
                        alt="Roshis Rai – Full-Stack Software Engineer"
                        width={400}
                        height={500}
                        className="w-full h-auto max-h-90 lg:max-h-90 object-cover"
                        priority={false}
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 rounded-2xl ring-1 ring-border/80 pointer-events-none"
                    />
                </div>

                <div
                    className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl border border-border -z-10 bg-surface/20"
                    aria-hidden="true"
                />
            </div>
        </div>
    )
}
