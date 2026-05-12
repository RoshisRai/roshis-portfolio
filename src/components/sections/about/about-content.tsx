export const AboutContent = () => {
    return (
        <div className="flex flex-col gap-6">
            <h2
                id="about-heading"
                className="about-animate text-[36px] font-bold leading-tight tracking-tight text-foreground"
            >
                About Me
            </h2>
            <div className="space-y-5 text-[17px] leading-[1.7] text-text-secondary font-normal">
                <p className="about-animate">
                    I&rsquo;m Roshis — a full-stack engineer who finds genuine satisfaction
                    in turning ambiguous product problems into systems that feel inevitable
                    in hindsight. Over the past few years I&rsquo;ve shipped everything from
                    real-time collaboration tools to ML-powered search pipelines, and the
                    thread connecting all of it is a stubborn belief that great engineering
                    should be invisible to the people it serves.
                </p>

                <p className="about-animate">
                    When I&rsquo;m not deep in a codebase, you&rsquo;ll probably find me
                    rebuilding vintage mechanical keyboards — there&rsquo;s something
                    meditative about hand-lubing switches and tuning stabilizers until a
                    board sounds exactly right. It&rsquo;s the same obsession with craft
                    that drives how I write software: every detail either earns its place or
                    gets removed.
                </p>

                <p className="about-animate">
                    I&rsquo;m currently open to senior or staff-level roles where I can pair
                    deep technical work with product thinking. If you&rsquo;re building
                    something ambitious and want an engineer who cares as much about
                    developer experience as end-user experience, let&rsquo;s talk.
                </p>
            </div>
        </div>
    )
}