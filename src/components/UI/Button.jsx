import { useState } from 'react';

const Button = ({ onClick, children, type = "button", style, disabled = false, backgroundColor, hoverColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    padding: '0.625rem 0.9375rem',
    backgroundColor: disabled ? '#aaa' : (isHovered ? hoverColor : backgroundColor),
    color: '#fff',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.5s',
    ...style // Применяем пользовательские стили, если они переданы
  };

  return (
    <button
      onClick={onClick}
      type={type}
      style={baseStyle}
      disabled={disabled}
      // Устанавливаем обработчики для наведения
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='bg-blue-600 text-white rounded-md'
    >
      {children}
    </button>
  );
}

export default Button;
