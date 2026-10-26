const VARIANTS = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300',
}

function Button({ children, type = 'button', variant = 'primary', disabled = false, onClick }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full sm:w-auto px-6 py-3 text-base font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]}`}
    >
      {children}
    </button>
  )
}

export default Button