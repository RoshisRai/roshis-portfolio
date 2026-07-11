export const AboutContent = () => {
    return (
        <div className="flex flex-col gap-6">
            <h2
                id="about-heading"
                className="about-animate text-[36px] font-bold leading-tight tracking-tight"
            >
                <span className="bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">About Me</span>
            </h2>
            <div className="space-y-5 text-[17px] leading-[1.7] text-text-secondary font-normal">
                <p className="about-animate">
                    I&apos;m Roshis — a full-stack software engineer based in Canada,
                    focused on building production-grade web applications, AI-powered systems,
                    and scalable backend architectures. I enjoy working across the stack,
                    from designing APIs and databases to building fast, responsive user interfaces.
                </p>

                <p className="about-animate">
                    My recent work has centered around AI integration and retrieval systems,
                    including building RAG pipelines, semantic search infrastructure,
                    and embedding-driven knowledge systems using tools like Supabase,
                    pgvector, and OpenAI APIs. I care a lot about system design, reliability,
                    and keeping codebases maintainable as they scale.
                </p>

                <p className="about-animate">
                    Outside of engineering, I like learning new technical concepts,
                    experimenting with side projects, and refining how I build software systems end-to-end.
                    I also enjoy staying hands-on with everything from backend architecture
                    to frontend interaction design.
                </p>

                <p className="about-animate">
                    I&apos;m currently open to opportunities where I can contribute to
                    AI-driven products, SaaS platforms, or systems that require strong engineering depth
                    and ownership. If you&apos;re building something challenging, I&apos;d be happy to connect.
                </p>
            </div>
        </div>
    )
}