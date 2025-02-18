export function MonthYearPickerInput({ value, onClick }) {
    return (
      <input
        type="text"
        value={value}
        onClick={onClick}
        readOnly={true}
        placeholder="MM/YYYY"
        style={{ cursor: 'pointer' }}
        className="date-picker-input"
      />
    );
  }