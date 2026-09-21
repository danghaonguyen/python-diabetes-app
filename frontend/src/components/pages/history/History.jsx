import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../services/apiClient";
import Footer from "../layout/Footer";
import HeaderTop from "../layout/HeaderTop";
import Navbar from "../layout/Navbar";
import HistoryDetailsModal from "./HistoryDetailsModal";
import HistoryFilters from "./HistoryFilters";
import HistoryTable from "./HistoryTable";
import "../css/Footer.css";
import "../css/History.css";

function History() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const [history, setHistory] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ day: null, month: null, year: null });

  useEffect(() => {
    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await api.get(`/history/${userId}`);
        setHistory(response.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Không thể tải lịch sử. Vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [navigate, userId]);

  const availableYears = useMemo(() => {
    const years = new Set();
    history.forEach(({ created_at }) => {
      const year = Number(String(created_at || "").slice(0, 4));
      if (Number.isInteger(year) && year >= 1900) years.add(year);
    });
    return [...years].sort((a, b) => b - a).map((year) => ({ value: String(year), label: String(year) }));
  }, [history]);

  const filteredHistory = useMemo(() => history.filter((item) => {
    const date = new Date(item.created_at);
    if (Number.isNaN(date.getTime())) return false;
    return (!filters.day || String(date.getDate()) === filters.day.value)
      && (!filters.month || String(date.getMonth() + 1) === filters.month.value)
      && (!filters.year || String(date.getFullYear()) === filters.year.value);
  }), [filters, history]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const deleteRecord = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Bạn có muốn xóa dự đoán này?</p>
          <div className="confirm-actions">
            <button type="button" onClick={async () => {
              try {
                await api.delete(`/history/${id}`);
                setHistory((records) => records.filter((item) => item.id !== id));
                toast.success("Đã xóa dự đoán.");
              } catch (requestError) {
                toast.error(requestError.response?.data?.message || "Xóa thất bại.");
              } finally {
                closeToast();
              }
            }}>Có</button>
            <button type="button" onClick={closeToast}>Không</button>
          </div>
        </div>
      ),
      { autoClose: false, closeButton: false, closeOnClick: false },
    );
  };

  const content = isLoading
    ? <div className="no-data-center">Đang tải lịch sử...</div>
    : error
      ? <div className="no-data-center">{error}</div>
      : filteredHistory.length === 0
        ? <div className="no-data-center">Không có bản ghi dự đoán phù hợp.</div>
        : <HistoryTable records={filteredHistory} onShowDetails={setSelectedRecord} onDelete={deleteRecord} />;

  return (
    <div className="page-shell">
      <HeaderTop />
      <Navbar />
      <main className="page-content">
        <section className="history-container">
          <h2>Lịch sử dự đoán</h2>
          <HistoryFilters filters={filters} onChange={updateFilter} years={availableYears} />
          {content}
        </section>
      </main>
      <Footer />
      <HistoryDetailsModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default History;
