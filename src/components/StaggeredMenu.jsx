import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './StaggeredMenu.css'

const EMPTY_ITEMS = []
const EMPTY_SOCIAL_ITEMS = []
const DEFAULT_COLORS = ['#ff8660', '#9a33ff']

const MenuPrelayers = ({ colors, preLayersRef }) => (
  <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
    {colors.slice(0, 3).map((color) => (
      <div key={color} className="sm-prelayer" style={{ background: color }} />
    ))}
  </div>
)

const MenuHeader = ({
  logoUrl,
  open,
  onToggle,
  textLines,
  toggleBtnRef,
  textInnerRef,
  iconRef,
  plusHRef,
  plusVRef,
}) => (
  <header className="staggered-menu-header" aria-label="Mobile navigation header">
    <div className="sm-logo" aria-label="Satvik Patel">
      <img src={logoUrl} alt="Satvik Patel logo" className="sm-logo-img" draggable={false} width={32} height={32} />
      <span className="sm-logo-text">Satvik</span>
    </div>

    <button
      ref={toggleBtnRef}
      className="sm-toggle"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="staggered-menu-panel"
      onClick={onToggle}
      type="button"
    >
      <span className="sm-toggle-textWrap" aria-hidden="true">
        <span ref={textInnerRef} className="sm-toggle-textInner">
          {textLines.map((line) => (
            <span className="sm-toggle-line" key={line.id}>
              {line.label}
            </span>
          ))}
        </span>
      </span>
      <span ref={iconRef} className="sm-icon" aria-hidden="true">
        <span ref={plusHRef} className="sm-icon-line" />
        <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
      </span>
    </button>
  </header>
)

const MenuPanel = ({ open, panelRef, items, displayItemNumbering, displaySocials, socialItems, onItemClick }) => (
  <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
    <div className="sm-panel-inner">
      <ul className="sm-panel-list" data-numbering={displayItemNumbering || undefined}>
        {items.map((item, index) => (
          <li className="sm-panel-itemWrap" key={item.label}>
            <a
              className="sm-panel-item"
              href={item.link}
              aria-label={item.ariaLabel}
              data-index={index + 1}
              onClick={(event) => onItemClick(event, item)}
            >
              <span className="sm-panel-itemLabel">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>

      {displaySocials && socialItems.length > 0 && (
        <div className="sm-socials" aria-label="Social links">
          <h3 className="sm-socials-title">Socials</h3>
          <ul className="sm-socials-list">
            {socialItems.map((social) => (
              <li key={social.label} className="sm-socials-item">
                <a href={social.link} target="_blank" rel="noopener noreferrer" className="sm-socials-link">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </aside>
)

const useClickAwayClose = ({ closeOnClickAway, open, panelRef, toggleBtnRef, closeMenu }) => {
  useEffect(() => {
    if (!closeOnClickAway || !open) return

    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeOnClickAway, closeMenu, open, panelRef, toggleBtnRef])
}

const StaggeredMenu = ({
  position = 'right',
  colors = DEFAULT_COLORS,
  items = EMPTY_ITEMS,
  socialItems = EMPTY_SOCIAL_ITEMS,
  displaySocials = true,
  displayItemNumbering = true,
  className = '',
  logoUrl = '/images/MX_LOGO.png',
  menuButtonColor = '#ffffff',
  openMenuButtonColor = '#111111',
  accentColor = '#ff8660',
  changeMenuColorOnOpen = true,
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef(null)
  const preLayersRef = useRef(null)
  const preLayerElsRef = useRef([])
  const plusHRef = useRef(null)
  const plusVRef = useRef(null)
  const iconRef = useRef(null)
  const textInnerRef = useRef(null)
  const [textLines, setTextLines] = useState([
    { id: 'initial-menu', label: 'Menu' },
    { id: 'initial-close', label: 'Close' },
  ])

  const openTlRef = useRef(null)
  const closeTweenRef = useRef(null)
  const spinTweenRef = useRef(null)
  const textCycleAnimRef = useRef(null)
  const colorTweenRef = useRef(null)
  const toggleBtnRef = useRef(null)
  const busyRef = useRef(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      const plusH = plusHRef.current
      const plusV = plusVRef.current
      const icon = iconRef.current
      const textInner = textInnerRef.current

      if (!panel || !plusH || !plusV || !icon || !textInner) return

      const preLayers = preContainer ? Array.from(preContainer.querySelectorAll('.sm-prelayer')) : []
      preLayerElsRef.current = preLayers

      const offscreen = position === 'left' ? -100 : 100
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 })
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInner, { yPercent: 0 })
      gsap.set(toggleBtnRef.current, { color: menuButtonColor })
    })

    return () => ctx.revert()
  }, [menuButtonColor, position])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null

    openTlRef.current?.kill()
    closeTweenRef.current?.kill()

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'))
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'))
    const socialTitle = panel.querySelector('.sm-socials-title')
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'))
    const offscreen = position === 'left' ? -100 : 100

    gsap.set(itemEls, { yPercent: 140, rotate: 10 })
    gsap.set(numberEls, { '--sm-num-opacity': 0 })
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
    gsap.set(socialLinks, { y: 25, opacity: 0 })

    const tl = gsap.timeline({ paused: true })

    layers.forEach((layer, index) => {
      tl.fromTo(layer, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, index * 0.07)
    })

    const panelStart = layers.length ? (layers.length - 1) * 0.07 + 0.08 : 0
    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, panelStart)

    tl.to(
      itemEls,
      {
        yPercent: 0,
        rotate: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: { each: 0.1, from: 'start' },
      },
      panelStart + 0.1
    )

    tl.to(
      numberEls,
      {
        duration: 0.6,
        ease: 'power2.out',
        '--sm-num-opacity': 1,
        stagger: { each: 0.08, from: 'start' },
      },
      panelStart + 0.2
    )

    if (socialTitle) {
      tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, panelStart + 0.35)
    }

    if (socialLinks.length) {
      tl.to(
        socialLinks,
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: { each: 0.08, from: 'start' } },
        panelStart + 0.4
      )
    }

    openTlRef.current = tl
    return tl
  }, [position])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true

    const tl = buildOpenTimeline()
    if (!tl) {
      busyRef.current = false
      return
    }

    tl.eventCallback('onComplete', () => {
      busyRef.current = false
    })
    tl.play(0)
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null

    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return

    const offscreen = position === 'left' ? -100 : 100
    closeTweenRef.current?.kill()
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(panel.querySelectorAll('.sm-panel-itemLabel'), { yPercent: 140, rotate: 10 })
        gsap.set(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'), { '--sm-num-opacity': 0 })
        gsap.set(panel.querySelectorAll('.sm-socials-link'), { y: 25, opacity: 0 })
        const socialTitle = panel.querySelector('.sm-socials-title')
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 })
        busyRef.current = false
      },
    })
  }, [position])

  const animateIcon = useCallback((opening) => {
    const icon = iconRef.current
    if (!icon) return

    spinTweenRef.current?.kill()
    spinTweenRef.current = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto',
    })
  }, [])

  const animateColor = useCallback(
    (opening) => {
      const btn = toggleBtnRef.current
      if (!btn) return

      colorTweenRef.current?.kill()
      const targetColor = changeMenuColorOnOpen && opening ? openMenuButtonColor : menuButtonColor
      colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' })
    },
    [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]
  )

  const animateText = useCallback((opening) => {
    const inner = textInnerRef.current
    if (!inner) return

    textCycleAnimRef.current?.kill()
    const currentLabel = opening ? 'Menu' : 'Close'
    const targetLabel = opening ? 'Close' : 'Menu'
    const seq = [currentLabel, targetLabel, currentLabel, targetLabel, targetLabel].map((label, step) => ({
      id: `${opening ? 'open' : 'close'}-${step}-${label}`,
      label,
    }))

    setTextLines(seq)
    gsap.set(inner, { yPercent: 0 })
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -((seq.length - 1) / seq.length) * 100,
      duration: 0.5 + seq.length * 0.07,
      ease: 'power4.out',
    })
  }, [])

  const closeMenu = useCallback(() => {
    if (!openRef.current) return

    openRef.current = false
    setOpen(false)
    onMenuClose?.()
    playClose()
    animateIcon(false)
    animateColor(false)
    animateText(false)
  }, [animateColor, animateIcon, animateText, onMenuClose, playClose])

  const toggleMenu = useCallback(() => {
    const target = !openRef.current
    openRef.current = target
    setOpen(target)

    if (target) {
      onMenuOpen?.()
      playOpen()
    } else {
      onMenuClose?.()
      playClose()
    }

    animateIcon(target)
    animateColor(target)
    animateText(target)
  }, [animateColor, animateIcon, animateText, onMenuClose, onMenuOpen, playClose, playOpen])

  const handleItemClick = useCallback(
    (event, item) => {
      if (item.id) {
        event.preventDefault()
        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
      }
      closeMenu()
    },
    [closeMenu]
  )

  useClickAwayClose({ closeOnClickAway, open, panelRef, toggleBtnRef, closeMenu })

  return (
    <div
      className={`${className} staggered-menu-wrapper${isFixed ? ' fixed-wrapper' : ''}`}
      style={accentColor ? { '--sm-accent': accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <MenuPrelayers colors={colors} preLayersRef={preLayersRef} />

      <MenuHeader
        logoUrl={logoUrl}
        open={open}
        onToggle={toggleMenu}
        textLines={textLines}
        toggleBtnRef={toggleBtnRef}
        textInnerRef={textInnerRef}
        iconRef={iconRef}
        plusHRef={plusHRef}
        plusVRef={plusVRef}
      />

      <MenuPanel
        open={open}
        panelRef={panelRef}
        items={items}
        displayItemNumbering={displayItemNumbering}
        displaySocials={displaySocials}
        socialItems={socialItems}
        onItemClick={handleItemClick}
      />
    </div>
  )
}

export default StaggeredMenu
