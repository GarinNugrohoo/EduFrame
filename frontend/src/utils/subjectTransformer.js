export const transformSubjectsData = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }

  return apiData.map((subject, index) => {
    return {
      id: subject.id || subject._id || `subject-${index}`,
      name: subject.name || subject.title || "Mata Pelajaran",
      subTitle:
        subject.grade_level || subject.grade || subject.level || "Kelas",
      description:
        subject.description ||
        subject.desc ||
        `Belajar ${
          subject.name || subject.title || "mata pelajaran"
        } dengan mudah`,
    };
  });
};
