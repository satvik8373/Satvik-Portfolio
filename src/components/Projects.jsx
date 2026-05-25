import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ExternalLink } from 'lucide-react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const projects = [
  {
    title: 'Mavrixfy',
    label: 'Music Streaming Platform',
    stack: 'React.js / React Native',
    image: '/assets/projects/mavrixfy.png',
    summary: 'A polished music experience with playlists, playback UI, responsive layouts, and API-led flows.',
    visitUrl: 'https://mavrixfy.site',
  },
  {
    title: 'SubTrack',
    label: 'Finance & Invoice Manager',
    stack: 'MERN Stack',
    image: '/assets/projects/SubTrack_Icon.webp',
    summary: 'A clean dashboard for subscriptions, expenses, invoices, CRUD operations, and backend integrations.',
    visitUrl: '',
  },
  {
    title: 'Pranshi Multiplast',
    label: 'Corporate Manufacturing Website',
    stack: 'React.js',
    image: '/assets/projects/pranshi-multiplast.png',
    summary: 'A responsive business website focused on product clarity, company presence, and fast browsing.',
    visitUrl: 'https://pranshimultiplast.com/',
  },
  {
    title: 'Suryoday Fortune',
    label: 'Business Website',
    stack: 'React.js',
    image: '/assets/projects/suryoday-fortune.png',
    summary: 'A professional web presence with structured content, responsive sections, and brand-first visuals.',
    visitUrl: '',
  },
]

const ProjectCounter = ({ value }) => {
  const numberRef = useRef(null)
  const currentValue = useRef(value)

  useEffect(() => {
    const state = { value: currentValue.current }

    const tween = gsap.to(state, {
      value,
      duration: 0.65,
      ease: 'power3.out',
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = String(Math.round(state.value)).padStart(2, '0')
        }
      },
      onComplete: () => {
        currentValue.current = value
      },
    })

    return () => tween.kill()
  }, [value])

  return (
    <span ref={numberRef} className="block tabular-nums">
      {String(value).padStart(2, '0')}
    </span>
  )
}

const Projects = () => {
  const sectionRef = useRef(null)
  const imageRefs = useRef([])
  const contentRefs = useRef([])
  const activeRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useGSAP(
    () => {
      const images = imageRefs.current.filter(Boolean)
      const contents = contentRefs.current.filter(Boolean)

      gsap.set(images, { autoAlpha: 0, x: 72, y: 56, scale: 0.98 })
      gsap.set(contents, { autoAlpha: 0, x: 18, y: 12 })
      gsap.set(images[0], { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' })
      gsap.set(contents[0], { autoAlpha: 1, x: 0, y: 0 })

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.25,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.max(0, Math.min(projects.length - 1, Math.round(self.progress * (projects.length - 1))))

            if (next !== activeRef.current) {
              activeRef.current = next
              setActiveIndex(next)
            }
          },
        },
      })

      projects.slice(0, -1).forEach((_, index) => {
        const position = index

        timeline
          .to(images[index], { autoAlpha: 0, x: -92, y: -68, scale: 0.97, duration: 0.95 }, position)
          .to(contents[index], { autoAlpha: 0, x: -16, y: -10, duration: 0.7 }, position + 0.08)
          .fromTo(
            images[index + 1],
            { autoAlpha: 0, x: 92, y: 68, scale: 0.98 },
            { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 1.15 },
            position + 0.22
          )
          .to(contents[index + 1], { autoAlpha: 1, x: 0, y: 0, duration: 0.82 }, position + 0.32)
      })

      return () => {
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-primary text-primary theme-transition"
      style={{ height: `${projects.length * 100}svh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <aside className="absolute left-[2.55vw] top-[49.2vh] z-20 hidden -translate-y-1/2 lg:block">
          <nav aria-label="Project progress" className="space-y-[1.05rem] font-serif text-xs italic text-muted">
            {projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                onClick={() => {
                  const y = sectionRef.current.offsetTop + window.innerHeight * index
                  window.scrollTo({ top: y, behavior: 'smooth' })
                }}
                className={`flex h-5 items-center gap-3 text-left transition-colors duration-500 ${
                  activeIndex === index ? 'text-primary' : 'text-muted/60 hover:text-secondary'
                }`}
              >
                <span className="w-2 text-center">{index + 1}</span>
                <span className={`h-px transition-all duration-500 ${activeIndex === index ? 'w-5 bg-current' : 'w-0 bg-transparent'}`} />
                <span className={`whitespace-nowrap font-semibold transition-opacity duration-500 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                  {project.title}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="absolute left-4 top-24 z-20 md:left-10 lg:left-[12.2vw] lg:top-[33.7vh]">
          <p className="max-w-[8rem] text-xs font-semibold uppercase leading-5 tracking-[0.55em] text-muted">
            Selected Work
          </p>
        </div>

        <div className="absolute left-[47vw] top-[38vh] z-10 aspect-[520/406] w-[38vw] max-w-[430px] -translate-x-1/2 -translate-y-1/2 max-lg:left-1/2 max-lg:top-[35vh] max-lg:w-[62vw]">
          {projects.map((project, index) => (
            <img
              key={project.title}
              ref={(element) => {
                imageRefs.current[index] = element
              }}
              src={project.image}
              alt={`${project.title} thumbnail`}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              draggable="false"
              className="absolute inset-0 h-full w-full object-contain will-change-transform"
            />
          ))}
        </div>

        <article className="absolute left-4 right-4 top-[52vh] z-20 min-h-[15rem] md:left-auto md:right-[13vw] md:top-[29.4vh] md:w-[18rem] lg:right-[12vw]">
          {projects.map((project, index) => (
            <div
              key={project.title}
              ref={(element) => {
                contentRefs.current[index] = element
              }}
              className="absolute inset-0 will-change-transform"
              aria-hidden={activeIndex !== index}
            >
              <p className="mb-4 hidden max-w-[15rem] text-[11px] font-bold uppercase leading-5 tracking-[0.35em] text-muted md:block">
                {project.label}
              </p>
              <h2 className="mb-3 max-w-[17rem] text-[1.7rem] font-black leading-none tracking-normal text-primary md:text-2xl">
                {project.title}
              </h2>
              <p className="max-w-[17rem] text-[1.05rem] font-bold leading-[1.42] tracking-normal text-secondary md:max-w-[16.2rem] md:text-base">
                {project.summary}
              </p>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.28em] text-muted md:mt-5 md:text-xs">{project.stack}</p>
              <div className="mt-5">
                {project.visitUrl ? (
                  <a
                    href={project.visitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={activeIndex === index ? 0 : -1}
                    aria-label={`Visit ${project.title}`}
                    className="inline-flex h-10 items-center gap-2 rounded-full border border-primary bg-secondary/70 px-4 text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-sm theme-transition hover:bg-gradient-orange-purple hover:text-white focus-theme md:h-11 md:px-5"
                  >
                    Visit Site
                    <ExternalLink size={15} strokeWidth={2.4} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="inline-flex h-10 items-center rounded-full border border-primary bg-secondary/40 px-4 text-xs font-bold uppercase tracking-[0.2em] text-muted md:h-11 md:px-5">
                    Private Build
                  </span>
                )}
              </div>
            </div>
          ))}
        </article>

        <div className="pointer-events-none absolute bottom-[3.5vh] left-8 z-0 select-none text-[27vw] font-black leading-none text-primary/10 md:bottom-[8.8vh] md:left-[9.7vw] md:text-[22vw] lg:text-[12.2rem] xl:text-[13.5rem]">
          <ProjectCounter value={activeIndex + 1} />
        </div>
      </div>
    </section>
  )
}

export default Projects
