'use client'

import { useState } from 'react'
import { Input, Textarea } from './input'
import { Button } from './button'
import { Tag } from './tag'
import { SectionHeading } from './section-heading'
import { Card, ExperienceCard, SkillCard } from './card'
import { Tooltip } from './tooltip'
import { SocialIconButton } from './social-icon-button'
import { InlineCode, CodeBlock } from './code-block'

export default function UIComponentsTest() {
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [notes, setNotes] = useState('')
  const [selected, setSelected] = useState(false)

  // SectionHeading test state
  const [shTitle, setShTitle] = useState('Projects & Experience')
  const [shSubtitle, setShSubtitle] = useState('A short description that expands on the heading.')
  const [shAlign, setShAlign] = useState<'left' | 'center' | 'right'>('left')
  const [shAs, setShAs] = useState<'h1' | 'h2' | 'h3'>('h2')

  return (
    <div className="p-6 space-y-8 pt-16">
      <h2 className="text-xl font-semibold">Input / Button / Tag Test</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Input
            label="Name"
            placeholder="Type your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={() => alert(`Hello, ${name || 'stranger'}!`)}>Greet</Button>
            <Button variant="ghost" onClick={() => setName('')}>
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Input
            variant="search"
            label="Search"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-sm text-text-secondary">Current query: {query || '—'}</div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          label=""
          placeholder="Write some notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-32"
        />
      </div>

      <div className="flex items-center gap-3">
        <Tag variant="filter" active={selected} onClick={() => setSelected((s) => !s)}>
          {selected ? 'Selected' : 'Unselected'}
        </Tag>

        <Tag variant="status" statusColor="#4ade80">
          Complete
        </Tag>

        <Tag variant="tech">React</Tag>

        <Button onClick={() => console.log({ name, query, notes, selected })}>Log State</Button>
      </div>

      {/* ===== SectionHeading tests ===== */}
      <div className="pt-8 border-t border-border space-y-4">
        <h3 className="text-lg font-medium">SectionHeading Examples</h3>

        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-semibold">Default (left)</div>
            <SectionHeading title="Default Left Heading" subtitle="Subtitle for the left-aligned heading." />
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold">Centered</div>
            <SectionHeading title="Centered Heading" subtitle="Centered subtitle." align="center" as="h2" />
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold">Right aligned (h3)</div>
            <SectionHeading title="Right Aligned" subtitle="Right-aligned subtitle." align="right" as="h3" />
          </div>

          <div className="pt-4">
            <div className="mb-2 text-sm font-semibold">Interactive test</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <Input label="Heading title" value={shTitle} onChange={(e) => setShTitle(e.target.value)} />
              <Input label="Subtitle" value={shSubtitle} onChange={(e) => setShSubtitle(e.target.value)} />
              <div className="flex items-center gap-2">
                <label className="text-sm">Align:</label>
                <select
                  value={shAlign}
                  onChange={(e) => setShAlign(e.target.value as 'left' | 'center' | 'right')}
                  className="h-9 px-3 border border-border rounded"
                >
                  <option value="left" className="text-sm bg-white dark:bg-gray-800">left</option>
                  <option value="center" className="text-sm bg-white dark:bg-gray-800">center</option>
                  <option value="right" className="text-sm bg-white dark:bg-gray-800">right</option>
                </select>

                <label className="text-sm ml-4">Element:</label>
                <select
                  value={shAs}
                  onChange={(e) => setShAs(e.target.value as 'h1' | 'h2' | 'h3')}
                  className="h-9 px-3 border border-border rounded bg-dark"
                >
                  <option value="h1" className="text-sm bg-white dark:bg-gray-800">h1</option>
                  <option value="h2" className="text-sm bg-white dark:bg-gray-800">h2</option>
                  <option value="h3" className="text-sm bg-white dark:bg-gray-800">h3</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-surface border border-border rounded">
              <SectionHeading title={shTitle} subtitle={shSubtitle} align={shAlign} as={shAs} />
            </div>
          </div>
        </div>
      </div>

      {/* Card Tests  */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Card Examples</h3>

        <Card>
            <h4 className="font-semibold">Simple Card</h4>
            <p className="text-sm text-text-secondary">This is a basic card wrapper.</p>
        </Card>

        <ExperienceCard
            role="Senior Engineer"
            company="Example Co"
            period="2020 — Present"
            location="Remote"
            description="Worked on multiple cross-platform applications and architecture design."
            tags={[ 'Leadership', 'System Design' ]}
        />
        <div className="grid grid-cols-3 gap-3">
            <SkillCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor"/></svg>} label="React" />
            <SkillCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" stroke="currentColor"/></svg>} label="TypeScript" sublabel="Proficient" />
            <SkillCard icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="currentColor"/></svg>} label="CSS" />
        </div>
        </div>

        {/* Tooltip Tests */}
        <div className="pt-8 border-t border-border space-y-4">
          <h3 className="text-lg font-medium">Tooltip Examples</h3>

          <div className="flex items-center gap-4">
            <div>
              <div className="mb-2 text-sm font-semibold">Hover / focus tooltip (top)</div>
              <Tooltip content={<span>Helpful info about this button</span>}>
                <Button>Hover me</Button>
              </Tooltip>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">Bottom tooltip</div>
              <Tooltip side="bottom" content={<span>Tooltip below the element</span>}>
                <Tag variant="tech">Hover</Tag>
              </Tooltip>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">Delayed tooltip (800ms)</div>
              <Tooltip delayMs={800} content={<span>Appears after 800ms</span>}>
                <Button variant="ghost">Delayed</Button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Social Icon Button Tests */}
        <div className="pt-8 border-t border-border space-y-4">
          <h3 className="text-lg font-medium">Social Icon Button Examples</h3>

          <div className="flex items-center gap-3">
            <SocialIconButton
              href="https://github.com"
              label="GitHub"
              variant="ghost"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.9.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.26 3.4.96.11-.75.41-1.26.74-1.55-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.19a11.03 11.03 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.44-2.71 5.41-5.29 5.69.42.36.8 1.07.8 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" stroke="currentColor" strokeWidth="0"/></svg>}
            />

            <SocialIconButton
              href="https://twitter.com"
              label="Twitter"
              variant="filled"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 12 6v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" stroke="currentColor" strokeWidth="0"/></svg>}
            />

            <SocialIconButton
              href="https://linkedin.com"
              label="LinkedIn"
              variant="ghost"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-14h4v2" stroke="currentColor" strokeWidth="0"/></svg>}
            />
          </div>
        </div>

        {/* Code Block Tests */}
        <div className="pt-8 border-t border-border space-y-4">
          <h3 className="text-lg font-medium">Code Block Examples</h3>

          <div className="space-y-3">
            <div>
              <div className="mb-2 text-sm font-semibold">Inline code inside text</div>
              <p className="text-base">
                Use <InlineCode>npm install</InlineCode> to add dependencies.
              </p>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">Rendered Shiki HTML (html prop)</div>
              <CodeBlock
                language="javascript"
                filename="example.js"
                code={`<pre><code class="language-js">const message = 'Hello from Shiki!';\nconsole.log(message);</code></pre>`}
                className="max-w-2xl"
              />
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">Plain code children (pre/code)</div>
              <CodeBlock language="bash" filename="run.sh">Simple Code</CodeBlock>
            </div>
          </div>
        </div>
    </div>
  )
}

export { UIComponentsTest }
