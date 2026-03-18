import { useEffect, useRef, useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IMaskInput } from 'react-imask'
import { supabase } from '../lib/supabase'
import { useFloatingEmojis } from '../hooks/useFloatingEmojis'

// ─── Schema ──────────────────────────────────────────────────────────────────
const schema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  whatsapp: z
    .string({ required_error: 'WhatsApp é obrigatório' })
    .min(1, 'WhatsApp é obrigatório')
    .min(14, 'WhatsApp inválido — preencha o número completo')
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato: (xx) xxxxx-xxxx'),
  email: z.string().email('E-mail inválido'),
  print: z
    .custom<FileList>()
    .refine((fl) => fl && fl.length > 0, 'Selecione o print do story')
    .refine(
      (fl) => fl && ['image/jpeg', 'image/png', 'image/webp'].includes(fl[0]?.type),
      'Formato inválido (use JPG, PNG ou WebP)',
    )
    .refine(
      (fl) => fl && fl[0]?.size <= 10 * 1024 * 1024,
      'Imagem muito grande (máx. 10MB)',
    ),
})

type FormData = z.infer<typeof schema>

// ─── Helpers ─────────────────────────────────────────────────────────────────
function randomId() {
  return Math.random().toString(36).slice(2, 10)
}

function generateFileName(file: File): string {
  const ext = file.name.split('.').pop() ?? 'jpg'
  return `${Date.now()}-${randomId()}.${ext}`
}

const SHEETS_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL as string | undefined

async function sendToSheets(data: {
  nome: string
  whatsapp: string
  email: string
  print_url: string | null
}) {
  if (!SHEETS_URL) return
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, timestamp: new Date().toISOString() }),
    })
  } catch {
    // Best-effort — falha no Sheets não bloqueia o sucesso do formulário
  }
}

async function uploadImage(file: File): Promise<string | null> {
  const fileName = generateFileName(file)
  const { error } = await supabase.storage
    .from('sorteio-prints')
    .upload(fileName, file, { contentType: file.type, upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('sorteio-prints').getPublicUrl(fileName)
  return data.publicUrl
}

// ─── Component ───────────────────────────────────────────────────────────────
interface Props {
  isOpen: boolean
  onClose: () => void
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export function ParticipationModal({ isOpen, onClose }: Props) {
  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const launchEmojis = useFloatingEmojis()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: '', whatsapp: '', email: '' },
  })

  const watchPrint = watch('print')

  // Update preview when file changes
  useEffect(() => {
    if (watchPrint && watchPrint[0]) {
      const url = URL.createObjectURL(watchPrint[0])
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [watchPrint])

  // Close on overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose],
  )

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset()
        setSubmitState('idle')
        setPreviewUrl(null)
      }, 300)
    }
  }, [isOpen, reset])

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const files = e.dataTransfer.files
      if (files.length) {
        setValue('print', files, { shouldValidate: true })
      }
    },
    [setValue],
  )

  const onSubmit = async (data: FormData) => {
    setSubmitState('loading')
    try {
      let print_url: string | null = null

      if (data.print[0]) {
        print_url = await uploadImage(data.print[0])
      }

      const { error } = await supabase.from('sorteio_pascoa').insert({
        nome: data.nome.trim(),
        whatsapp: data.whatsapp,
        email: data.email.trim().toLowerCase(),
        print_url,
      })

      if (error) throw error

      void sendToSheets({
        nome: data.nome.trim(),
        whatsapp: data.whatsapp,
        email: data.email.trim().toLowerCase(),
        print_url,
      })

      setSubmitState('success')
      launchEmojis()
    } catch (err) {
      console.error('Submission error:', err)
      setSubmitState('error')
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(62,41,32,0.55)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: '#F5F0E8',
          border: '1px solid rgba(201,169,110,0.3)',
          animation: 'scaleInModal 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Header stripe */}
        <div
          className="px-6 pt-6 pb-5"
          style={{
            background: 'linear-gradient(135deg, #5C3D2E 0%, #7A5240 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl mb-1">🐣</p>
              <h2 className="font-serif text-xl font-bold text-white leading-tight">
                Participar do Sorteio
              </h2>
              <p className="text-sm mt-1" style={{ color: '#E8C4B8' }}>
                Preencha com cuidado — sua participação depende disso!
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar modal"
              className="ml-4 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:bg-white/20 active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {submitState === 'success' ? (
            <SuccessCard onClose={onClose} />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              {/* Nome */}
              <Field label="Nome completo" error={errors.nome?.message} required>
                <input
                  {...register('nome')}
                  type="text"
                  placeholder="Seu nome completo"
                  className="form-input"
                  autoComplete="name"
                />
              </Field>

              {/* WhatsApp */}
              <Field label="WhatsApp" error={errors.whatsapp?.message} required>
                <Controller
                  name="whatsapp"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      mask="(00) 00000-0000"
                      value={field.value ?? ''}
                      onAccept={(value) => field.onChange(value)}
                      placeholder="(11) 99999-9999"
                      className="form-input"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  )}
                />
              </Field>

              {/* Email */}
              <Field label="E-mail" error={errors.email?.message} required>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="seu@email.com"
                  className="form-input"
                  autoComplete="email"
                  inputMode="email"
                />
              </Field>

              {/* File upload */}
              <Field label="Print do story/promoção" error={errors.print?.message} required>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleFileDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  className="relative cursor-pointer rounded-xl transition-all duration-200"
                  style={{
                    border: `2px dashed ${dragOver ? '#4A6B8A' : errors.print ? '#e85555' : '#C9A96E'}`,
                    background: dragOver
                      ? 'rgba(74,107,138,0.08)'
                      : previewUrl
                      ? 'transparent'
                      : 'rgba(201,169,110,0.06)',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: previewUrl ? '0' : '20px',
                    overflow: 'hidden',
                  }}
                >
                  {previewUrl ? (
                    <div className="relative w-full">
                      <img
                        src={previewUrl}
                        alt="Preview do story"
                        className="w-full max-h-48 object-contain rounded-xl"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-xl"
                        style={{ background: 'rgba(62,41,32,0.5)' }}
                      >
                        <span className="text-white text-sm font-medium">
                          Clique para trocar 📸
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className="text-3xl block mb-2">📸</span>
                      <p
                        className="text-sm font-medium"
                        style={{ color: '#7A5240' }}
                      >
                        Arraste ou clique para enviar o print
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#B08A50' }}>
                        JPG, PNG ou WebP • Máx. 10MB
                      </p>
                    </div>
                  )}
                  <input
                    {...register('print')}
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="absolute inset-0 opacity-0 w-0 h-0"
                    tabIndex={-1}
                    onChange={(e) => {
                      register('print').onChange(e)
                      if (e.target.files?.[0]) {
                        setValue('print', e.target.files, { shouldValidate: true })
                      }
                    }}
                  />
                </div>
              </Field>

              {/* Error state */}
              {submitState === 'error' && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background: 'rgba(232,85,85,0.1)',
                    border: '1px solid rgba(232,85,85,0.3)',
                    color: '#c0392b',
                  }}
                >
                  ⚠️ Algo deu errado. Verifique sua conexão e tente novamente.
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitState === 'loading'}
                className="w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background:
                    submitState === 'loading'
                      ? 'linear-gradient(135deg, #7A5240 0%, #9A6A50 100%)'
                      : 'linear-gradient(135deg, #5C3D2E 0%, #7A5240 100%)',
                  boxShadow: '0 4px 16px rgba(92,61,46,0.3)',
                }}
              >
                {submitState === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner />
                    Enviando...
                  </span>
                ) : (
                  'Enviar Participação 🍫'
                )}
              </button>

              {/* Disclaimer */}
              <p className="text-xs text-center" style={{ color: '#B08A50' }}>
                Seus dados são utilizados apenas para o sorteio. Não compartilhamos
                suas informações.
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes scaleInModal {
          from { opacity: 0; transform: scale(0.88) translateY(12px) }
          to { opacity: 1; transform: scale(1) translateY(0) }
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1.5px solid rgba(201,169,110,0.35);
          background: rgba(255,255,255,0.7);
          color: #3E2920;
          font-size: 0.9375rem;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .form-input:focus {
          border-color: #4A6B8A;
          box-shadow: 0 0 0 3px rgba(74,107,138,0.2);
        }
        .form-input::placeholder {
          color: #B08A50;
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: '#5C3D2E' }}
      >
        {label}
        {required && <span style={{ color: '#C9A96E' }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#c0392b' }}>
          {error}
        </p>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="3" strokeOpacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

const WHATSAPP_URL = 'https://api.whatsapp.com/message/5UQASUY2BNTGH1?autoload=1&app_absent=0'

function SuccessCard({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="text-center py-6"
      style={{ animation: 'scaleInModal 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
    >
      <div className="text-6xl mb-4 block">🎉</div>
      <h3
        className="font-serif text-2xl font-bold mb-2"
        style={{ color: '#3E2920' }}
      >
        Participação registrada!
      </h3>
      <p className="text-sm leading-relaxed mb-6" style={{ color: '#7A5240' }}>
        Boa sorte! Acompanhe o resultado pelo nosso Instagram{' '}
        <a
          href="https://instagram.com/querodoka"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
          style={{ color: '#4A6B8A' }}
        >
          @querodoka
        </a>{' '}
        🐣
      </p>

      {/* WhatsApp CTA */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:opacity-90 active:scale-95 mb-3"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          boxShadow: '0 4px 16px rgba(37,211,102,0.35)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Falar com a Doka no WhatsApp
      </a>

      <button
        onClick={onClose}
        className="text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: '#B08A50' }}
      >
        Fechar
      </button>
    </div>
  )
}
