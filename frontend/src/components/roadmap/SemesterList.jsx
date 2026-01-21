import SemesterCard from "./SemesterCard";

const SemesterList = ({
  semesters,
  openSemesters,
  onMaterialClick,
  onToggleSemester,
  onToggleAll,
}) => {
  const allOpen = Object.values(openSemesters).every((v) => v);
  const anyOpen = Object.values(openSemesters).some((v) => v);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Struktur Pembelajaran ({semesters.length} Semester)
        </h2>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {Object.values(openSemesters).filter((v) => v).length} terbuka
          </span>

          <button
            onClick={onToggleAll}
            className="text-xs text-red-600 font-medium px-3 py-1 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            {allOpen ? "Tutup Semua" : anyOpen ? "Tutup Semua" : "Buka Semua"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {semesters.map((semester, index) => (
          <SemesterCard
            key={semester.id}
            semester={semester}
            semesterNumber={semester.semester_number || index + 1}
            isOpen={openSemesters[semester.id] || false}
            onToggle={() => onToggleSemester(semester.id)}
            onMaterialClick={onMaterialClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SemesterList;
