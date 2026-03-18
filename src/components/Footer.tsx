import { useState } from 'react'

export function Footer() {
  const [open, setOpen] = useState(false)

  return (
    <footer
      style={{
        background: '#334B61',
        borderTop: '1px solid rgba(201,169,110,0.15)',
      }}
    >
      {/* Terms accordion */}
      <div className="border-b" style={{ borderColor: 'rgba(201,169,110,0.12)' }}>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: '#C9A96E' }}
        >
          <span>📋 Termos da Promoção</span>
          <span
            className="transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ▾
          </span>
        </button>

        {open && (
          <div
            className="px-6 pb-6 text-left text-xs leading-relaxed space-y-4"
            style={{ color: 'rgba(232,196,184,0.85)' }}
          >
            <p className="font-semibold text-sm" style={{ color: '#C9A96E' }}>
              TERMOS DA PROMOÇÃO — QUERODOKA PÁSCOA
            </p>

            {/* Condições */}
            <div>
              <p className="font-semibold mb-1" style={{ color: '#E8C4B8' }}>
                🎁 Condições para receber o brinde
              </p>
              <p>
                O brinde será liberado somente quando a página QueRodoka atingir{' '}
                <strong style={{ color: '#C9A96E' }}>3.500 seguidores</strong> no Instagram.
              </p>
            </div>

            {/* Requisitos */}
            <div>
              <p className="font-semibold mb-2" style={{ color: '#E8C4B8' }}>
                ✅ Requisitos para o ganhador
              </p>
              <ol className="space-y-1 list-decimal list-inside">
                <li><strong>Print correto</strong> — Fazer um print correto da sua participação na promoção</li>
                <li><strong>Enviar informações</strong> — Enviar o print e suas informações pessoais conforme solicitado</li>
                <li><strong>Seguir @querodoka</strong> — Estar seguindo a página no Instagram no momento do sorteio</li>
              </ol>
            </div>

            {/* Informações importantes */}
            <div>
              <p className="font-semibold mb-2" style={{ color: '#E8C4B8' }}>
                📋 Informações importantes
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li>A promoção é válida enquanto a meta de seguidores não for atingida</li>
                <li>O ganhador será anunciado após atingirmos 3.500 seguidores</li>
                <li>É necessário cumprir <strong>todos</strong> os requisitos para ser elegível</li>
                <li>Participe quantas vezes quiser, mas cada participação deve cumprir os requisitos</li>
                <li>Siga @querodoka no Instagram para acompanhar o progresso da meta</li>
              </ul>
            </div>

            {/* Elegibilidade */}
            <div>
              <p className="font-semibold mb-2" style={{ color: '#E8C4B8' }}>
                Elegibilidade
              </p>
              <p className="mb-1">Para participar e ser elegível, você deve:</p>
              <ul className="space-y-1">
                <li>✓ Fazer print correto da participação</li>
                <li>✓ Enviar as informações solicitadas</li>
                <li>✓ Estar seguindo @querodoka no Instagram</li>
                <li>✓ Aguardar o anúncio do ganhador após atingir 3.500 seguidores</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Copyright bar */}
      <div className="py-6 px-6 text-center">
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
      </div>
    </footer>
  )
}
