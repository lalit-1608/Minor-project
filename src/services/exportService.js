// CSV Export Service
// Generates clean, RFC-4180 compliant CSV files with download triggers.

function escapeCSV(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const exportService = {
  exportFacultyReport(rankedFaculty, departments) {
    const headers = [
      'Rank',
      'Faculty Name',
      'Department',
      'Designation',
      'Feedback Count',
      'Average Rating (out of 5)',
      'Percentage Score',
      'Performance Status',
      'Subject Knowledge Avg',
      'Clarity Avg',
      'Communication Avg',
      'Engagement Avg',
      'Punctuality Avg',
      'Satisfaction Avg'
    ];

    const rows = rankedFaculty.map(item => {
      const dept = departments.find(d => d.id === item.faculty.departmentId)?.name || 'Unknown';
      return [
        item.rank,
        item.faculty.name,
        dept,
        item.faculty.designation,
        item.feedbackCount,
        item.overallAverage.toFixed(2),
        `${item.percentage.toFixed(2)}%`,
        item.statusInfo.status,
        item.parameterAverages.subjectKnowledge?.toFixed(2) || '0.00',
        item.parameterAverages.clarity?.toFixed(2) || '0.00',
        item.parameterAverages.communication?.toFixed(2) || '0.00',
        item.parameterAverages.engagement?.toFixed(2) || '0.00',
        item.parameterAverages.punctuality?.toFixed(2) || '0.00',
        item.parameterAverages.satisfaction?.toFixed(2) || '0.00'
      ].map(escapeCSV).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    triggerDownload(csvContent, `StudySnippet_Faculty_Performance_${new Date().toISOString().slice(0, 10)}.csv`);
  },

  exportDepartmentReport(deptStats) {
    const headers = [
      'Department Name',
      'Code',
      'Faculty Count',
      'Feedback Count',
      'Average Rating',
      'Percentage Score'
    ];

    const rows = deptStats.map(d => [
      d.department.name,
      d.department.code,
      d.facultyCount,
      d.feedbackCount,
      d.overallAverage.toFixed(2),
      `${d.percentage.toFixed(2)}%`
    ].map(escapeCSV).join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    triggerDownload(csvContent, `StudySnippet_Department_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  },

  exportSemesterReport(semStats) {
    const headers = [
      'Semester',
      'Feedback Count',
      'Average Rating',
      'Percentage Score',
      'Highest Rated Parameter',
      'Lowest Rated Parameter'
    ];

    const rows = semStats.map(s => [
      s.semester,
      s.feedbackCount,
      s.overallAverage.toFixed(2),
      `${s.percentage.toFixed(2)}%`,
      s.highestParameter,
      s.lowestParameter
    ].map(escapeCSV).join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    triggerDownload(csvContent, `StudySnippet_Semester_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  },

  exportFeedbackRecords(feedbackList, facultyList, subjectsList, departmentsList, isAdmin = true) {
    const headers = isAdmin
      ? [
          'Feedback ID',
          'Date & Time',
          'Faculty',
          'Department',
          'Subject',
          'Semester',
          'Class',
          'Subject Knowledge',
          'Explanation / Clarity',
          'Communication',
          'Engagement',
          'Punctuality',
          'Overall Satisfaction',
          'Average',
          'Constructive Comment'
        ]
      : [
          'Feedback ID',
          'Date & Time',
          'Faculty',
          'Department',
          'Subject',
          'Semester',
          'Class',
          'Constructive Comment'
        ];

    const rows = feedbackList.map(fb => {
      const faculty = facultyList.find(f => f.id === fb.facultyId)?.name || 'Unknown';
      const dept = departmentsList.find(d => d.id === fb.departmentId)?.name || 'Unknown';
      const subject = subjectsList.find(s => s.id === fb.subjectId);
      const subjectStr = subject ? `${subject.code} - ${subject.name}` : 'Unknown';

      const avg = (Object.values(fb.ratings).reduce((a, b) => a + b, 0) / 6).toFixed(2);

      const data = isAdmin
        ? [
            fb.id,
            new Date(fb.createdAt).toLocaleString(),
            faculty,
            dept,
            subjectStr,
            `Sem ${fb.semester}`,
            fb.className,
            fb.ratings.subjectKnowledge,
            fb.ratings.clarity,
            fb.ratings.communication,
            fb.ratings.engagement,
            fb.ratings.punctuality,
            fb.ratings.satisfaction,
            avg,
            fb.comment || ''
          ]
        : [
            fb.id,
            new Date(fb.createdAt).toLocaleString(),
            faculty,
            dept,
            subjectStr,
            `Sem ${fb.semester}`,
            fb.className,
            fb.comment || ''
          ];

      return data.map(escapeCSV).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    triggerDownload(csvContent, `StudySnippet_Feedback_Records_${new Date().toISOString().slice(0, 10)}.csv`);
  }
};
