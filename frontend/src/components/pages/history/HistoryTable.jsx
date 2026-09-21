import { formatDateTime, formatGender, formatNumber, formatProbability, formatRisk, getRiskClass } from "./historyUtils";

function HistoryRow({ record, onShowDetails, onDelete }) {
  return (
    <tr>
      <td>{formatDateTime(record.created_at)}</td>
      <td>{record.age}</td>
      <td>{formatGender(record.gender)}</td>
      <td>{formatNumber(record.glucose)}</td>
      <td>{formatNumber(record.bmi)}</td>
      <td>{formatNumber(record.pulse_rate)}</td>
      <td className={getRiskClass(record.prediction_result)}>{formatRisk(record.prediction_result)}</td>
      <td>{formatProbability(record.prediction_probability)}</td>
      <td>
        <div className="table-actions">
          <button type="button" onClick={() => onShowDetails(record)}>Chi tiết</button>
          <button type="button" className="delete-button" onClick={() => onDelete(record.id)}>Xóa</button>
        </div>
      </td>
    </tr>
  );
}

function HistoryTable({ records, onShowDetails, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="history-table">
        <thead><tr><th>Ngày</th><th>Tuổi</th><th>Giới tính</th><th>Đường huyết</th><th>BMI</th><th>Nhịp tim</th><th>Nguy cơ</th><th>Xác suất</th><th>Thao tác</th></tr></thead>
        <tbody>
          {records.map((record) => (
            <HistoryRow key={record.id} record={record} onShowDetails={onShowDetails} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryTable;
