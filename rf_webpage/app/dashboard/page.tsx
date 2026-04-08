"use client"
import Navbar from "@/components/layout/Navbar"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

// ─── Types ────────────────────────────────────────────────────────────────────
type Client = {
  id: string
  cedula: string
  name: string
  phone: string
  birth_date: string
  sex: string
  occupation: string
  eps: string
  emi: string
  start_date: string
  end_date: string
  created_by: string
}

type Evaluation = {
  id: string
  client_id: string
  created_at: string
  created_by?: string
  diabetes: boolean
  hypertension: boolean
  varices: boolean
  heart_disease: boolean
  other_diseases: string
  allergies: string
  medications: string
  exercise_history: string
  nutrition_history: string
  observations: string
  diagnosis: string
  treatment: string
  package: string
  sessions_count: number
  total_value: number
}

const emptyClient: Omit<Client, "id" | "created_by"> = {
  cedula: "", name: "", phone: "", birth_date: "", sex: "",
  occupation: "", eps: "", emi: "", start_date: "", end_date: "",
}

const emptyEvaluation: Omit<Evaluation, "id" | "client_id" | "created_at" | "created_by"> = {
  diabetes: false, hypertension: false, varices: false, heart_disease: false,
  other_diseases: "", allergies: "", medications: "", exercise_history: "",
  nutrition_history: "", observations: "", diagnosis: "", treatment: "",
  package: "", sessions_count: 0, total_value: 0,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const initials = (name: string) =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()

const formatDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—"

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v)

// ─── Sub-components ───────────────────────────────────────────────────────────
function Badge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-colors
      ${active ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-500"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-red-400"}`} />
      {label}
    </span>
  )
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  )
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition placeholder:text-gray-300 ${className}`}
      {...props}
    />
  )
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={2}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition placeholder:text-gray-300 resize-none ${className}`}
      {...props}
    />
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
        ${checked
          ? "bg-rose-50 border-rose-300 text-rose-700"
          : "bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300"}`}
    >
      <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-xs
        ${checked ? "bg-rose-500 border-rose-500 text-white" : "border-gray-300"}`}>
        {checked && "✓"}
      </span>
      {label}
    </button>
  )
}

// ─── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, maxW = "max-w-2xl" }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxW?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm pt-12 pb-6 px-4 overflow-y-auto">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxW} animate-in fade-in zoom-in-95 duration-200`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Client Form ──────────────────────────────────────────────────────────────
function ClientForm({
  form, setForm, onSubmit, onCancel, loading, submitLabel = "Guardar"
}: {
  form: typeof emptyClient
  setForm: (f: typeof emptyClient) => void
  onSubmit: () => void
  onCancel: () => void
  loading?: boolean
  submitLabel?: string
}) {
  const set = (k: keyof typeof emptyClient) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value })

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup label="Cédula">
          <Input placeholder="Ej: 1234567890" value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} />
        </FieldGroup>
        <FieldGroup label="Nombre completo">
          <Input placeholder="Ej: María González" value={form.name} onChange={set("name")} />
        </FieldGroup>
        <FieldGroup label="Teléfono">
          <Input placeholder="Ej: 3001234567" value={form.phone} onChange={set("phone")} />
        </FieldGroup>
        <FieldGroup label="Fecha de nacimiento">
          <Input type="date" value={form.birth_date} onChange={set("birth_date")} />
        </FieldGroup>
        <FieldGroup label="Sexo">
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            value={form.sex} onChange={set("sex")}
          >
            <option value="">Seleccionar…</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
        </FieldGroup>
        <FieldGroup label="Ocupación">
          <Input placeholder="Ej: Enfermera, Docente…" value={form.occupation} onChange={set("occupation")} />
        </FieldGroup>
        <FieldGroup label="EPS">
          <Input placeholder="Ej: Sura, Sanitas…" value={form.eps} onChange={set("eps")} />
        </FieldGroup>
        <FieldGroup label="EMI / Seguro">
          <Input placeholder="Ej: Medisalud…" value={form.emi} onChange={set("emi")} />
        </FieldGroup>
        <FieldGroup label="Fecha de inicio">
          <Input type="date" value={form.start_date} onChange={set("start_date")} />
        </FieldGroup>
        <FieldGroup label="Fecha de fin">
          <Input type="date" value={form.end_date} onChange={set("end_date")} />
        </FieldGroup>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          disabled={loading || !form.name || !form.cedula}
          className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando…" : submitLabel}
        </button>
      </div>
    </div>
  )
}

// ─── Evaluation Form ──────────────────────────────────────────────────────────
function EvaluationForm({
  form, setForm, onSubmit, onCancel, loading, isEdit = false
}: {
  form: typeof emptyEvaluation
  setForm: (f: typeof emptyEvaluation) => void
  onSubmit: () => void
  onCancel: () => void
  loading?: boolean
  isEdit?: boolean
}) {
  const setText = (k: keyof typeof emptyEvaluation) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value })
  const setNum = (k: keyof typeof emptyEvaluation) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: Number(e.target.value) })
  const toggleBool = (k: keyof typeof emptyEvaluation) => (v: boolean) =>
    setForm({ ...form, [k]: v })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Antecedentes médicos</p>
        <div className="flex flex-wrap gap-2">
          <Toggle label="Diabetes" checked={form.diabetes as boolean} onChange={toggleBool("diabetes")} />
          <Toggle label="Hipertensión" checked={form.hypertension as boolean} onChange={toggleBool("hypertension")} />
          <Toggle label="Várices" checked={form.varices as boolean} onChange={toggleBool("varices")} />
          <Toggle label="Cardiopatía" checked={form.heart_disease as boolean} onChange={toggleBool("heart_disease")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup label="Otras enfermedades">
          <Textarea placeholder="Describir si aplica…" value={form.other_diseases as string} onChange={setText("other_diseases")} />
        </FieldGroup>
        <FieldGroup label="Alergias">
          <Textarea placeholder="Medicamentos, alimentos, materiales…" value={form.allergies as string} onChange={setText("allergies")} />
        </FieldGroup>
        <FieldGroup label="Medicamentos actuales">
          <Textarea placeholder="Nombre y dosis…" value={form.medications as string} onChange={setText("medications")} />
        </FieldGroup>
        <FieldGroup label="Historial de ejercicio">
          <Textarea placeholder="Tipo de actividad, frecuencia…" value={form.exercise_history as string} onChange={setText("exercise_history")} />
        </FieldGroup>
        <FieldGroup label="Historial nutricional">
          <Textarea placeholder="Dieta habitual, restricciones…" value={form.nutrition_history as string} onChange={setText("nutrition_history")} />
        </FieldGroup>
        <FieldGroup label="Observaciones generales">
          <Textarea placeholder="Notas adicionales…" value={form.observations as string} onChange={setText("observations")} />
        </FieldGroup>
      </div>

      <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup label="Diagnóstico">
          <Textarea placeholder="Diagnóstico clínico…" value={form.diagnosis as string} onChange={setText("diagnosis")} />
        </FieldGroup>
        <FieldGroup label="Tratamiento">
          <Textarea placeholder="Plan de tratamiento…" value={form.treatment as string} onChange={setText("treatment")} />
        </FieldGroup>
        <FieldGroup label="Paquete">
          <Input placeholder="Ej: Paquete Relax 5 sesiones" value={form.package as string} onChange={setText("package")} />
        </FieldGroup>
        <FieldGroup label="Nº de sesiones">
          <Input type="number" min={0} value={form.sessions_count as number} onChange={setNum("sessions_count")} />
        </FieldGroup>
        <FieldGroup label="Valor total (COP)">
          <Input type="number" min={0} step={1000} value={form.total_value as number} onChange={setNum("total_value")} />
        </FieldGroup>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:brightness-110 transition disabled:opacity-50"
        >
          {loading ? "Guardando…" : isEdit ? "Actualizar ficha" : "Guardar nueva evaluación"}
        </button>
      </div>
    </div>
  )
}

// ─── Evaluation History Card ──────────────────────────────────────────────────
function EvaluationHistoryItem({
  evaluation,
  index,
  onEdit,
}: {
  evaluation: Evaluation
  index: number
  onEdit: (ev: Evaluation) => void
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
            ${index === 0 ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
            {index === 0 ? "★" : index + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {index === 0 ? "Evaluación actual" : `Evaluación ${index + 1}`}
              {" · "}
              <span className="font-normal text-gray-400">{formatDate(evaluation.created_at)}</span>
            </p>
            {evaluation.package && (
              <p className="text-xs text-gray-400">{evaluation.package} · {evaluation.sessions_count} ses · {formatCurrency(evaluation.total_value)}</p>
            )}
          </div>
        </div>
        <span className={`text-gray-300 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>›</span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-3 text-sm">
          {/* Antecedentes */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge label="Diabetes" active={evaluation.diabetes} />
            <Badge label="Hipertensión" active={evaluation.hypertension} />
            <Badge label="Várices" active={evaluation.varices} />
            <Badge label="Cardiopatía" active={evaluation.heart_disease} />
          </div>

          {[
            { label: "Otras enfermedades", value: evaluation.other_diseases },
            { label: "Alergias", value: evaluation.allergies },
            { label: "Medicamentos", value: evaluation.medications },
            { label: "Historial de ejercicio", value: evaluation.exercise_history },
            { label: "Historial nutricional", value: evaluation.nutrition_history },
            { label: "Observaciones", value: evaluation.observations },
            { label: "Diagnóstico", value: evaluation.diagnosis },
            { label: "Tratamiento", value: evaluation.treatment },
          ].filter(x => x.value).map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-gray-700">{value}</p>
            </div>
          ))}

          {evaluation.package && (
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 grid grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-gray-400">Paquete</p>
                <p className="font-semibold text-gray-700 text-xs leading-tight">{evaluation.package}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Sesiones</p>
                <p className="font-semibold text-gray-700">{evaluation.sessions_count}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Valor</p>
                <p className="font-semibold text-gray-700 text-xs">{formatCurrency(evaluation.total_value)}</p>
              </div>
            </div>
          )}

          {/* Edit button — only for correction purposes */}
          <div className="flex justify-end pt-1">
            <button
              onClick={() => onEdit(evaluation)}
              className="text-xs text-gray-400 hover:text-primary font-medium hover:underline transition"
            >
              ✏ Corregir datos
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Client Detail Panel ──────────────────────────────────────────────────────
function ClientDetail({
  client,
  evaluations,
  onEdit,
  onDelete,
  onNewEvaluation,
  onEditEvaluation,
  onClose,
}: {
  client: Client
  evaluations: Evaluation[]
  onEdit: () => void
  onDelete: () => void
  onNewEvaluation: () => void
  onEditEvaluation: (ev: Evaluation) => void
  onClose: () => void
}) {
  const age = client.birth_date
    ? Math.floor((Date.now() - new Date(client.birth_date).getTime()) / 3.156e10)
    : null

  const latestEval = evaluations[0] || null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
          {initials(client.name)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{client.name}</h3>
          <p className="text-sm text-gray-400">{client.occupation || "Sin ocupación"} {age ? `· ${age} años` : ""}</p>
        </div>
      </div>

      {/* Info básica */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { label: "Cédula", value: client.cedula },
          { label: "Teléfono", value: client.phone },
          { label: "Sexo", value: client.sex },
          { label: "EPS", value: client.eps },
          { label: "EMI", value: client.emi },
          { label: "Inicio", value: formatDate(client.start_date) },
          { label: "Fin", value: formatDate(client.end_date) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="font-semibold text-gray-700">{value || "—"}</p>
          </div>
        ))}
      </div>

      {/* Evaluaciones */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Evaluaciones clínicas
            {evaluations.length > 0 && (
              <span className="ml-2 bg-primary/10 text-primary px-1.5 py-0.5 rounded-full text-xs font-bold">
                {evaluations.length}
              </span>
            )}
          </p>
          <button
            onClick={onNewEvaluation}
            className="text-xs text-primary font-semibold hover:underline"
          >
            + Nueva evaluación
          </button>
        </div>

        {evaluations.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-400">Sin evaluaciones clínicas</p>
            <button
              onClick={onNewEvaluation}
              className="mt-2 text-xs text-primary font-semibold hover:underline"
            >
              Crear primera evaluación →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {evaluations.map((ev, i) => (
              <EvaluationHistoryItem
                key={ev.id}
                evaluation={ev}
                index={i}
                onEdit={onEditEvaluation}
              />
            ))}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex justify-between pt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
        >
          Cerrar
        </button>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition"
          >
            Editar paciente
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  // evaluationsMap: client_id → Evaluation[] ordenado por created_at DESC
  const [evaluationsMap, setEvaluationsMap] = useState<Record<string, Evaluation[]>>({})
  const [search, setSearch] = useState("")
  const [sexFilter, setSexFilter] = useState("")
  const [loading, setLoading] = useState(false)

  // Modals
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showNewEvaluation, setShowNewEvaluation] = useState(false)
  const [showEditEvaluation, setShowEditEvaluation] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const [selected, setSelected] = useState<Client | null>(null)
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null)
  const [clientForm, setClientForm] = useState<typeof emptyClient>({ ...emptyClient })
  const [evaluationForm, setEvaluationForm] = useState<typeof emptyEvaluation>({ ...emptyEvaluation })

  useEffect(() => { fetchClients() }, [])

  const fetchClients = async () => {
    const { data } = await supabase.from("clients").select("*").order("name")
    setClients(data || [])
    if (data?.length) fetchEvaluations(data.map((c: Client) => c.id))
  }

  const fetchEvaluations = async (ids: string[]) => {
    const { data } = await supabase
      .from("client_evaluations")
      .select("*")
      .in("client_id", ids)
      .order("created_at", { ascending: false })

    const map: Record<string, Evaluation[]> = {}
    ;(data || []).forEach((ev: Evaluation) => {
      if (!map[ev.client_id]) map[ev.client_id] = []
      map[ev.client_id].push(ev)
    })
    setEvaluationsMap(map)
  }

  const filtered = clients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.cedula?.includes(search) ||
      c.occupation?.toLowerCase().includes(search.toLowerCase())
    const matchSex = sexFilter ? c.sex === sexFilter : true
    return matchSearch && matchSex
  })

  // ── Create client
  const handleCreate = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from("clients")
      .insert({ ...clientForm, created_by: user?.id })
      .select()

    if (error) { alert(error.message); setLoading(false); return }

    console.log("INSERT CLIENT:", data)
    setShowCreate(false)
    setClientForm({ ...emptyClient })
    setLoading(false)
    fetchClients()
  }

  // ── Edit client
  const openEdit = (c: Client) => {
    setSelected(c)
    setClientForm({
      cedula: c.cedula, name: c.name, phone: c.phone, birth_date: c.birth_date, sex: c.sex,
      occupation: c.occupation, eps: c.eps, emi: c.emi,
      start_date: c.start_date, end_date: c.end_date,
    })
    setShowEdit(true)
    setShowDetail(false)
  }

  const handleEdit = async () => {
    if (!selected) return
    setLoading(true)
    await supabase.from("clients").update(clientForm).eq("id", selected.id)
    setShowEdit(false)
    setLoading(false)
    fetchClients()
  }

  // ── Delete client
  const handleDelete = async () => {
    if (!selected) return
    const confirmDelete = confirm(`¿Seguro que quieres eliminar a ${selected.name}?\nSe borrarán también todas sus evaluaciones.`)
    if (!confirmDelete) return

    setLoading(true)
    // Las evaluaciones se borran en cascada si la FK tiene ON DELETE CASCADE
    const { error } = await supabase.from("clients").delete().eq("id", selected.id)
    setLoading(false)

    if (error) { alert(error.message); return }

    setShowDetail(false)
    setSelected(null)
    fetchClients()
  }

  // ── Open detail
  const openDetail = (c: Client) => {
    setSelected(c)
    setShowDetail(true)
  }

  // ── New evaluation (INSERT — nunca sobreescribe)
  const openNewEvaluation = (c: Client) => {
    setSelected(c)
    // Pre-poblar con la última evaluación para no perder antecedentes conocidos
    const lastEval = (evaluationsMap[c.id] || [])[0]
    if (lastEval) {
      setEvaluationForm({
        diabetes: lastEval.diabetes,
        hypertension: lastEval.hypertension,
        varices: lastEval.varices,
        heart_disease: lastEval.heart_disease,
        other_diseases: lastEval.other_diseases,
        allergies: lastEval.allergies,
        medications: lastEval.medications,
        exercise_history: lastEval.exercise_history,
        nutrition_history: lastEval.nutrition_history,
        observations: "",        // observaciones frescas
        diagnosis: "",           // diagnóstico fresco
        treatment: "",           // tratamiento fresco
        package: "",             // nuevo paquete
        sessions_count: 0,
        total_value: 0,
      })
    } else {
      setEvaluationForm({ ...emptyEvaluation })
    }
    setShowNewEvaluation(true)
    setShowDetail(false)
  }

  const handleNewEvaluation = async () => {
    if (!selected) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("client_evaluations")
      .insert({
        ...evaluationForm,
        client_id: selected.id,
        created_by: user?.id,
      })
      .select()

    if (error) { alert(error.message); setLoading(false); return }

    console.log("INSERT EVALUATION:", data)
    setShowNewEvaluation(false)
    setLoading(false)
    fetchClients()
  }

  // ── Edit evaluation (solo corrección de datos existentes)
  const openEditEvaluation = (ev: Evaluation) => {
    setSelectedEvaluation(ev)
    setEvaluationForm({
      diabetes: ev.diabetes,
      hypertension: ev.hypertension,
      varices: ev.varices,
      heart_disease: ev.heart_disease,
      other_diseases: ev.other_diseases,
      allergies: ev.allergies,
      medications: ev.medications,
      exercise_history: ev.exercise_history,
      nutrition_history: ev.nutrition_history,
      observations: ev.observations,
      diagnosis: ev.diagnosis,
      treatment: ev.treatment,
      package: ev.package,
      sessions_count: ev.sessions_count,
      total_value: ev.total_value,
    })
    setShowEditEvaluation(true)
    setShowDetail(false)
  }

  const handleEditEvaluation = async () => {
    if (!selectedEvaluation) return
    setLoading(true)

    const { error } = await supabase
      .from("client_evaluations")
      .update(evaluationForm)
      .eq("id", selectedEvaluation.id)

    if (error) { alert(error.message); setLoading(false); return }

    setShowEditEvaluation(false)
    setSelectedEvaluation(null)
    setLoading(false)
    fetchClients()
  }

  // ── Stats
  const stats = {
    total: clients.length,
    withEvaluations: Object.keys(evaluationsMap).length,
    active: clients.filter(c => c.end_date && new Date(c.end_date) >= new Date()).length,
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-primary/5 to-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">

        {/* ── Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Pacientes</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión de clientes y fichas clínicas del spa</p>
        </div>

        {/* ── Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total pacientes", value: stats.total, color: "text-primary" },
            { label: "Con evaluaciones", value: stats.withEvaluations, color: "text-emerald-600" },
            { label: "Activos", value: stats.active, color: "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Toolbar */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="relative flex-1 min-w-50">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, cédula, teléfono u ocupación…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={sexFilter}
            onChange={(e) => setSexFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-gray-500"
          >
            <option value="">Todos</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Otro">Otro</option>
          </select>

          <button
            onClick={() => { setClientForm({ ...emptyClient }); setShowCreate(true) }}
            className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition shadow-sm shadow-primary/20 whitespace-nowrap"
          >
            + Nuevo paciente
          </button>
        </div>

        {/* ── Client list */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <p className="text-4xl mb-3">🌿</p>
            <p className="text-sm">No se encontraron pacientes</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((client) => {
              const evals = evaluationsMap[client.id] || []
              const latestEval = evals[0] || null
              const isActive = client.end_date && new Date(client.end_date) >= new Date()
              const age = client.birth_date
                ? Math.floor((Date.now() - new Date(client.birth_date).getTime()) / 3.156e10)
                : null

              return (
                <div
                  key={client.id}
                  onClick={() => openDetail(client)}
                  className="group bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                    {initials(client.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 truncate">{client.name}</p>
                      {isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium shrink-0">Activo</span>
                      )}
                      {evals.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium shrink-0">
                          {evals.length} eval{evals.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {client.phone} {age ? `· ${age} años` : ""} {client.occupation ? `· ${client.occupation}` : ""}
                    </p>
                  </div>

                  {/* Right side: latest eval */}
                  <div className="text-right shrink-0 hidden sm:block">
                    {latestEval ? (
                      <div className="text-xs text-gray-400">
                        <p className="font-medium text-gray-600">{latestEval.package || "Sin paquete"}</p>
                        <p>{latestEval.sessions_count} sesiones · {formatCurrency(latestEval.total_value)}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">Sin evaluaciones</span>
                    )}
                  </div>

                  <span className="text-gray-200 group-hover:text-primary transition shrink-0">›</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ─────── MODALS ─────── */}

      {/* Create client */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nuevo paciente">
        <ClientForm
          form={clientForm} setForm={setClientForm}
          onSubmit={handleCreate} onCancel={() => setShowCreate(false)}
          loading={loading}
        />
      </Modal>

      {/* Edit client */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Editar paciente">
        <ClientForm
          form={clientForm} setForm={setClientForm}
          onSubmit={handleEdit} onCancel={() => setShowEdit(false)}
          loading={loading} submitLabel="Actualizar"
        />
      </Modal>

      {/* Detail */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)} title="Ficha del paciente" maxW="max-w-lg">
        {selected && (
          <ClientDetail
            client={selected}
            evaluations={evaluationsMap[selected.id] || []}
            onEdit={() => openEdit(selected)}
            onDelete={handleDelete}
            onNewEvaluation={() => openNewEvaluation(selected)}
            onEditEvaluation={openEditEvaluation}
            onClose={() => setShowDetail(false)}
          />
        )}
      </Modal>

      {/* Nueva evaluación */}
      <Modal
        open={showNewEvaluation}
        onClose={() => setShowNewEvaluation(false)}
        title={`Nueva evaluación · ${selected?.name || ""}`}
        maxW="max-w-2xl"
      >
        <EvaluationForm
          form={evaluationForm} setForm={setEvaluationForm}
          onSubmit={handleNewEvaluation} onCancel={() => setShowNewEvaluation(false)}
          loading={loading} isEdit={false}
        />
      </Modal>

      {/* Corregir evaluación */}
      <Modal
        open={showEditEvaluation}
        onClose={() => setShowEditEvaluation(false)}
        title={`Corregir evaluación · ${formatDate(selectedEvaluation?.created_at || "")}`}
        maxW="max-w-2xl"
      >
        <EvaluationForm
          form={evaluationForm} setForm={setEvaluationForm}
          onSubmit={handleEditEvaluation} onCancel={() => setShowEditEvaluation(false)}
          loading={loading} isEdit={true}
        />
      </Modal>
    </main>
  )
}