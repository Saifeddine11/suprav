import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import '../App.css'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page introuvable — Supra v3'
  }, [])

  return (
    <section
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ maxWidth: 560 }}
      >
        <p
          style={{
            fontSize: 'clamp(72px, 16vw, 120px)',
            fontWeight: 900,
            lineHeight: 1,
            margin: '0 0 16px',
            color: 'var(--color-accent, #E8491C)',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          404
        </p>

        <h1
          style={{
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 700,
            margin: '0 0 16px',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          Page introuvable
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--color-text-muted, #888)',
            margin: '0 0 40px',
            lineHeight: 1.7,
          }}
        >
          Cette page n'existe pas ou a été déplacée.
          Revenez à l'accueil pour retrouver nos services.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'var(--color-accent, #E8491C)',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 700,
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            Retour à l'accueil
          </Link>

          <Link
            to="/devis-gratuit"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: 'transparent',
              color: 'var(--color-accent, #E8491C)',
              border: '2px solid var(--color-accent, #E8491C)',
              borderRadius: 8,
              fontWeight: 700,
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            Obtenir un devis
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
