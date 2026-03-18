export function Footer() {
  return (
    <footer
      className="py-8 px-6 text-center"
      style={{
        background: '#334B61',
        borderTop: '1px solid rgba(201,169,110,0.15)',
      }}
    >
      <p className="text-sm font-medium" style={{ color: '#C9A96E' }}>
        © 2026 Doka •{' '}
        <a
          href="https://instagram.com/querodoka"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: '#E8C4B8' }}
        >
          @querodoka
        </a>{' '}
        • Feito com 🍫
      </p>
    </footer>
  )
}
