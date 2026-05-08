import type { Skill } from "@/types/skill";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export const socialLinks = [
    {
        href: 'https://github.com/RoshisRai',
        icon: FaGithub,
        label: 'GitHub'
    },
    {
        href: 'https://linkedin.com/in/roshis-rai',
        icon: FaLinkedin,
        label: 'LinkedIn'
    },
    {
        href: 'https://x.com/RoshisRai',
        icon: FaTwitter,
        label: 'Twitter'
    }
]

export const skills: Skill[] = [
    // Frontend
    {
        name: 'React',
        icon: '/images/skills/react.svg',
        category: 'Frontend',
    },
    {
        name: 'Next.js',
        icon: '/images/skills/nextjs.svg',
        category: 'Frontend',
    },
    {
        name: 'TypeScript',
        icon: '/images/skills/typescript.svg',
        category: 'Frontend',
    },
    {
        name: 'JavaScript',
        icon: '/images/skills/js.svg',
        category: 'Frontend',
        usedIn: [
            {
                projectName: 'GoodMil Construction & Real Estate Website',
                slug: 'goodmil-construction',
                context: 'Interactive UI and scroll animations',
            },
            {
                projectName: 'Sara Global Store E-Commerce Suite',
                slug: 'saraglobal-store',
                context: 'AJAX cart and product discovery UX',
            },
            {
                projectName: 'Uncharted Pages Bookstore Platform',
                slug: 'uncharted-pages',
                context: 'Particles.js effects and dynamic UI',
            },
        ]
    },
    {
        name: 'Tailwind CSS',
        icon: '/images/skills/tailwind.svg',
        category: 'Frontend',
    },
    // Backend
    {
        name: 'Node.js',
        icon: '/images/skills/node-js.svg',
        category: 'Backend',
        usedIn: [
            {
                projectName: 'Enterprise Subscription Management & Reminder System',
                slug: 'enterprise-subscription-management-system',
                context: 'RESTful API and lifecycle workflows',
            },
        ]
    },
    {
        name: 'Express',
        icon: '/images/skills/express.svg',
        category: 'Backend',
        usedIn: [
            {
                projectName: 'Enterprise Subscription Management & Reminder System',
                slug: 'enterprise-subscription-management-system',
                context: 'Versioned API routes and controllers',
            },
        ]
    },
    {
        name: 'Django',
        icon: '/images/skills/django.svg',
        category: 'Backend',
        usedIn: [
            {
                projectName: 'GoodMil Construction & Real Estate Website',
                slug: 'goodmil-construction',
                context: 'CMS, property search, and admin tooling',
            },
            {
                projectName: 'Sara Global Store E-Commerce Suite',
                slug: 'saraglobal-store',
                context: 'E-commerce workflows and admin automation',
            },
            {
                projectName: 'Uncharted Pages Bookstore Platform',
                slug: 'uncharted-pages',
                context: 'Publishing platform and order management',
            },
        ]
    },
    {
        name: 'Python',
        icon: '/images/skills/python.svg',
        category: 'Backend',
        usedIn: [
            {
                projectName: 'EveryLinguaAI — Multilingual Voice Assistant',
                slug: 'everylingua-ai',
                context: 'Real-time voice orchestration and NLP pipeline',
            },
            {
                projectName: 'GoodMil Construction & Real Estate Website',
                slug: 'goodmil-construction',
                context: 'Django backend and data modeling',
            },
            {
                projectName: 'Sara Global Store E-Commerce Suite',
                slug: 'saraglobal-store',
                context: 'Backend logic and order workflow automation',
            },
            {
                projectName: 'Uncharted Pages Bookstore Platform',
                slug: 'uncharted-pages',
                context: 'CMS, orders, and admin workflows',
            },
        ]
    },
    {
        name: 'MongoDB',
        icon: '/images/skills/mongodb.svg',
        category: 'Backend',
        usedIn: [
            {
                projectName: 'Enterprise Subscription Management & Reminder System',
                slug: 'enterprise-subscription-management-system',
                context: 'Multi-tenant data modeling and lifecycle queries',
            },
        ]
    },
    {
        name: 'PostgreSQL',
        icon: '/images/skills/postgresql.svg',
        category: 'Backend',
        usedIn: [
            {
                projectName: 'GoodMil Construction & Real Estate Website',
                slug: 'goodmil-construction',
                context: 'Relational data store for CMS and listings',
            },
            {
                projectName: 'Sara Global Store E-Commerce Suite',
                slug: 'saraglobal-store',
                context: 'Production database for catalog and orders',
            },
        ]
    },
    {
        name: 'Redis',
        icon: '/images/skills/redis.svg',
        category: 'Backend',
    },
    {
        name: 'GraphQL',
        icon: '/images/skills/graphql.svg',
        category: 'Backend',
    },
    {
        name: 'Prisma',
        icon: '/images/skills/prisma.svg',
        category: 'Backend',
    },
    // DevOps & Infrastructure
    {
        name: 'Docker',
        icon: '/images/skills/docker.svg',
        category: 'DevOps & Infrastructure',
    },
    {
        name: 'AWS',
        icon: '/images/skills/aws.svg',
        category: 'DevOps & Infrastructure',
    },
    {
        name: 'GitHub Actions',
        icon: '/images/skills/github-actions.svg',
        category: 'DevOps & Infrastructure',
    },
    // AI & Automation
    {
        name: 'Vercel AI SDK',
        icon: '/images/skills/vercel.svg',
        category: 'AI & Automation',
    },
    {
        name: 'OpenAI',
        icon: '/images/skills/openai.svg',
        category: 'AI & Automation',
        usedIn: [
            {
                projectName: 'EveryLinguaAI — Multilingual Voice Assistant',
                slug: 'everylingua-ai',
                context: 'GPT-powered multilingual conversational responses',
            },
        ]
    },
    {
        name: 'LangChain',
        icon: '/images/skills/langchain.svg',
        category: 'AI & Automation',
    },
    // Tools & Workflow
    {
        name: 'Git',
        icon: '/images/skills/git.svg',
        category: 'Tools & Workflow',
    },
    {
        name: 'C++',
        icon: '/images/skills/cpp.svg',
        category: 'Tools & Workflow',
    },
]