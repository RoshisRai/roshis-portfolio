'use client'

const PLACEHOLDER_MESSAGES = [
    { id: 1, role: 'user', content: 'What projects has Roshis built?' },
    { id: 2, role: 'assistant', content: 'Roshis has built several full-stack applications including a multi-tenant SaaS platform, an invoicing tool for event staffing agencies, and a Slack automation bot with OpenAI integration for a staffing client. He also built his personal portfolio site you\'re on right now.' },
    { id: 3, role: 'user', content: 'What\'s his tech stack?' },
    { id: 4, role: 'assistant', content: 'His core stack is Next.js, React, TypeScript, Node.js, and Express on the backend. He also works with Django, GraphQL, Firebase, and has experience integrating AI APIs. For styling he uses Tailwind CSS, and for animations GSAP and Framer Motion.' },
    { id: 5, role: 'user', content: 'Is he open to new opportunities?' },
    { id: 6, role: 'assistant', content: 'Yes! Roshis is actively looking for full-stack and backend engineering roles. He brings 4+ years of experience and a strong foundation in building scalable web applications. Feel free to reach out via the contact section.' },
    { id: 7, role: 'user', content: 'Tell me about his backend experience.' },
    { id: 8, role: 'assistant', content: 'On the backend, Roshis has built REST APIs with Node.js/Express and Django, worked with PostgreSQL and Firebase, and designed systems with role-based access control. He\'s also built CI/CD pipelines with GitHub Actions and deployed on Vercel.' },
]

export default function ChatMessages() {
    return (
        <div className="flex flex-col gap-4 py-6">
            {PLACEHOLDER_MESSAGES.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                            ${message.role === 'user'
                                ? 'bg-accent/20 border border-accent/30 text-text-primary rounded-br-sm'
                                : 'bg-text-primary/5 border border-border text-text-primary/90 rounded-bl-sm'
                            }`}
                    >
                        {message.content}
                    </div>
                </div>
            ))}
        </div>
    )
}