import React from 'react';

/**
 * Input component với label và error message
 */
const Input = React.forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  error = null,
  required = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-bold text-neutral-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 border rounded bg-white text-neutral-900 placeholder-neutral-400
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900
          transition-colors duration-205
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:border-neutral-900'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-600 font-semibold">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
