function Input({ id, label, type = 'text', value, onChange, error, placeholder, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-1 block w-full rounded-lg border bg-white px-4 py-3 text-base text-slate-800 focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-blue-600 focus:ring-blue-200'
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input