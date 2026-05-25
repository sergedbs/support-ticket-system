import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="btn-secondary" type="button" onClick={toggleTheme}>
      {theme === 'dark' ? 'Light' : 'Dark'} mode
    </button>
  );
}
