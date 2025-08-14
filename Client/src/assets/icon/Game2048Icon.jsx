
const Game2048Icon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={props.size || 40}
    height={props.size || 40}
    fill="none"
    {...props}
  >
    <rect x="4" y="4" width="56" height="56" rx="12" style={{ fill: 'var(--bg-ter)', stroke: 'var(--accent)', strokeWidth: 4 }} />
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="28" style={{ fill: 'var(--txt)' }}>
      2048
    </text>
  </svg>
);

export default Game2048Icon;
