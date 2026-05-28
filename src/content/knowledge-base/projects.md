# Roshis Rai — Projects

## Enterprise Subscription Management and Reminder System
Slug: enterprise-subscription-management-system  
Type: SaaS Platform, Backend Infrastructure, Automation  
Timeline: 2025  
Role: Full-Stack Developer

### Summary
A multi-tenant subscription lifecycle management platform designed for SaaS businesses requiring durable workflow orchestration, automated renewal reminders, tenant-scoped access control, and secure backend infrastructure.

### Architecture
- Multi-tenant REST API architecture with tenant-scoped data isolation
- Centralized subscription lifecycle state machine
- Durable event-driven workflow orchestration using Upstash QStash
- JWT-based authentication and RBAC authorization system
- Distributed reminder scheduling with retry-safe workflows

### Core Features
- Subscription creation, renewal, cancellation, and lifecycle tracking
- Automated reminder workflows at configurable intervals
- Tenant-isolated subscription and user management
- Audit logging and activity tracking
- Rate limiting and bot protection for public API endpoints

### Engineering Work
- Designed a centralized lifecycle state machine to enforce deterministic subscription state transitions
- Implemented durable asynchronous reminder workflows resilient to server restarts and cold starts
- Enforced multi-tenant query isolation at the database layer to prevent cross-tenant data access
- Integrated Arcjet for rate limiting and automated abuse protection

### Technologies
Node.js, Express, MongoDB, Mongoose, JWT, Upstash QStash, Arcjet, Nodemailer, Day.js

### Metrics
- 4-stage automated reminder workflow
- 5 RBAC permission levels
- 1000+ managed subscription records

### Links
GitHub: https://github.com/RoshisRai/Subscription-API

---

## EveryLinguaAI
Slug: everylingua-ai  
Type: AI System, Voice Assistant, NLP Pipeline  
Timeline: 2025 – 2026  
Role: AI and Backend Developer

### Summary
A modular multilingual voice assistant system supporting wake-word activation, dynamic language switching, real-time speech processing, and GPT-powered conversational interaction.

### Architecture
- Event-driven audio processing pipeline
- Modular speech-to-text, translation, reasoning, and text-to-speech stages
- Continuous interaction loop with self-resetting execution flow
- Dynamic microphone detection and fallback handling
- Configurable language and model orchestration system

### Core Features
- Wake-word activation with fuzzy matching
- Real-time multilingual speech processing
- Dynamic language detection and translation
- GPT-powered conversational responses
- Automatic microphone calibration and recovery workflows

### Engineering Work
- Designed the assistant as independently swappable pipeline modules to simplify future model and provider replacement
- Implemented fuzzy wake-word matching for improved tolerance to accents and pronunciation variance
- Built automatic microphone fallback logic for hardware failure recovery
- Structured the interaction loop to continuously reset state without requiring process restarts

### Technologies
Python, OpenAI APIs, SpeechRecognition, PyAudio, Deep Translator, TTS Engines, dotenv

### Metrics
- 80+ supported languages
- 9 modular pipeline components
- Continuous self-resetting interaction workflow

### Links
GitHub: https://github.com/RoshisRai/EveryLinguaAI

---

## Sara Global Store
Slug: saraglobal-store  
Type: E-Commerce Platform  
Timeline: 2024  
Role: Full-Stack Developer

### Summary
A production-ready e-commerce platform supporting product management, shopping workflows, inventory tracking, promotions, and order fulfillment for a retail business.

### Architecture
- Modular Django application architecture
- Relational product and order management system
- AJAX-driven frontend interaction workflows
- Stateful order lifecycle processing
- Admin-driven inventory and promotion management

### Core Features
- Product catalog and inventory management
- Shopping cart and wishlist workflows
- Multi-address checkout system
- Promotional code engine
- Order tracking and automated email notifications

### Engineering Work
- Designed a multi-stage order state machine with automated notification triggers
- Implemented AJAX-driven cart interactions to reduce full-page reload workflows
- Built flexible discount logic supporting fixed and percentage-based promotional rules
- Structured the backend around reusable commerce-focused application modules

### Technologies
Django, Python, PostgreSQL, JavaScript, jQuery, HTML, CSS, SQLite, Pillow

### Metrics
- 5-stage order lifecycle workflow
- 100+ managed products
- Multiple integrated commerce modules

### Links
Live Site: https://sarastore.pythonanywhere.com/

---

## GoodMil Construction and Real Estate Platform
Slug: goodmil-construction  
Type: CMS Platform, Real Estate System  
Timeline: 2023  
Role: Full-Stack Web Developer

### Summary
A Django-based construction and real estate platform supporting project showcases, property discovery, blog publishing, and administrative content management.

### Architecture
- CMS-driven backend platform
- Relational property and content data models
- Dynamic multi-filter property search workflows
- Responsive frontend animation system
- Media and SEO optimization pipeline

### Core Features
- Construction portfolio management
- Property listing and filtering system
- Administrative CMS workflows
- Inquiry and lead management
- Scroll-driven animated frontend experience

### Engineering Work
- Designed compound property filtering workflows optimized for relational query performance
- Structured CMS architecture around independently scalable content domains
- Built responsive animation systems using GSAP and AOS
- Implemented automated image optimization workflows using Pillow

### Technologies
Django, Python, PostgreSQL, JavaScript, jQuery, GSAP, AOS, Swiper, HTML, CSS, Pillow

### Metrics
- 12+ relational database models
- 50+ showcased construction projects
- Multiple integrated CMS domains

### Links
Live Demo: https://amritconstruction.pythonanywhere.com/

---

## Uncharted Pages
Slug: uncharted-pages  
Type: Publishing Platform, E-Commerce System  
Timeline: 2024  
Role: Full-Stack Web Developer

### Summary
A publishing and bookstore platform combining blog publishing, order workflows, subscriber engagement, and immersive frontend interactions.

### Architecture
- Django-based publishing platform
- Blog and content management workflows
- Receipt-based order validation pipeline
- Interactive multi-page frontend system
- Subscriber and inquiry management workflows

### Core Features
- Blog publishing and categorization
- Book ordering and receipt upload workflows
- Subscriber and newsletter management
- Interactive frontend visual effects
- Administrative publishing workflows

### Engineering Work
- Built a receipt validation workflow for manual payment verification without requiring payment gateway infrastructure
- Implemented ambient visual rendering using Particles.js while maintaining frontend responsiveness
- Structured the publishing system around reusable content management workflows

### Technologies
Django, Python, JavaScript, jQuery, Particles.js, HTML, CSS, SQLite, Pillow

### Metrics
- 100+ processed order workflows
- Multiple publishing and ordering subsystems
- Responsive multi-page frontend architecture

### Links
Live Demo: https://unchartedpages.pythonanywhere.com/

---

## Fitness Club
Slug: fitness-club  
Type: Full-Stack Web Application  
Timeline: 2023  
Role: Full-Stack Developer

### Summary
A full-stack membership and scheduling platform built to explore MVC architecture, authentication systems, server-side rendering, and backend workflow design.

### Architecture
- MVC application structure using Express
- Session-based authentication system
- Server-side rendered frontend using EJS
- Relational-style membership workflow modeling in MongoDB
- Test-oriented backend validation workflow

### Core Features
- User authentication and protected routes
- Membership management workflows
- Class scheduling and trainer assignment
- Appointment booking system
- User account management portal

### Engineering Work
- Implemented protected route verification for all state-changing account workflows
- Used server-side rendering for dynamic frontend delivery without a client-side framework
- Wrote Jest-based authentication tests to reduce regression risk on critical workflows
- Designed membership lifecycle flows covering upgrades, downgrades, and cancellations

### Technologies
Node.js, Express, MongoDB, EJS, Jest, JavaScript, HTML, CSS

### Links
GitHub: https://github.com/RoshisRai/FitnessClub