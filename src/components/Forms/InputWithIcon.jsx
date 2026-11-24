export default function InputWithIcon({
  type = 'text',
  placeholder,
  icon: Icon,
  value,
  onChange,
  name,
  id,
  required,
  disabled,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-life-blue focus:outline-none focus:ring-1 focus:ring-life-blue ${Icon ? 'pl-10' : 'pl-4'}`}
          {...props}
        />
      </div>
    </div>
  );
}
