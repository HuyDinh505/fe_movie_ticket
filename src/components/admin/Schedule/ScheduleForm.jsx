import React, { useState, useEffect } from "react";

const ScheduleForm = ({
  movieList = [],
  cinemaList = [],
  initialData,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [form, setForm] = useState({
    movie_id: "",
    cinema_id: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        movie_id: initialData.movie_id || "",
        cinema_id: initialData.cinema_id || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
      });
    } else {
      setForm({ movie_id: "", cinema_id: "", start_date: "", end_date: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data before submit:", form);
    if (onSubmit) onSubmit(form);
  };

  return (
    <div style={{ minWidth: 350 }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <form onSubmit={handleSubmit}>
        <h2 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>
          {initialData ? "Chỉnh sửa lịch chiếu" : "Tạo lịch chiếu"}
        </h2>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Phim chiếu
          </label>
          <select
            name="movie_id"
            value={form.movie_id}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            required
            disabled={loading}
          >
            <option value="">Select a movie</option>
            {(Array.isArray(movieList) ? movieList : []).map((movie) => (
              <option key={movie.movie_id} value={movie.movie_id}>
                {movie.movie_name || movie.title || movie.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Rạp chiếu
          </label>
          <select
            name="cinema_id"
            value={form.cinema_id}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            required
            disabled={loading}
          >
            <option value="">Chọn rạp</option>
            {(Array.isArray(cinemaList) ? cinemaList : []).map((cinema) => (
              <option key={cinema.cinema_id} value={cinema.cinema_id}>
                {cinema.cinema_name || cinema.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Ngày bắt đầu
          </label>
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            required
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Ngày kết thúc
          </label>
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            required
            disabled={loading}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              background: "#1976d2",
              color: "#fff",
              padding: 10,
              border: "none",
              borderRadius: 4,
              fontWeight: 500,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginRight: 8,
                  }}
                />
                Đang xử lý...
              </>
            ) : initialData ? (
              "Lưu thay đổi"
            ) : (
              "Lưu"
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                background: "#eee",
                color: "#333",
                padding: 10,
                border: "none",
                borderRadius: 4,
              }}
              disabled={loading}
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
