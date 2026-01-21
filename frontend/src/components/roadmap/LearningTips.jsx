import {
  ClockIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  BookOpenIcon,
} from "../icons/IkonWrapper";

const LearningTips = () => {
  const tips = [
    {
      icon: BookOpenIcon,
      title: "Belajar bertahap",
      description: "Selesaikan satu materi sebelum lanjut ke materi berikutnya",
    },
    {
      icon: PlayCircleIcon,
      title: "Tonton dengan fokus",
      description: "Matikan notifikasi saat menonton video pembelajaran",
    },
    {
      icon: ClockIcon,
      title: "Atur waktu belajar",
      description: "Sisihkan 30-60 menit setiap hari untuk belajar konsisten",
    },
    {
      icon: CheckCircleIcon,
      title: "Evaluasi progress",
      description: "Review materi yang sudah dipelajari setiap minggu",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
      <h3 className="text-base font-bold text-gray-900 mb-3">
        Tips Belajar Efektif
      </h3>
      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">
                  {tip.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningTips;
