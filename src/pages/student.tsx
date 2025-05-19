import { useState } from 'react';

import { Box } from '@mui/system';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { useUserCompletion } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard/content';

import { StudentDashboardView } from 'src/sections/student/view/student-dashboard-view';

export default function StudentPage() {
  const { data, isLoading, error } = useUserCompletion();
  const [selectedId, setSelectedId] = useState('');

  if (isLoading) {
    return <DashboardContent>Đang tải dữ liệu học viên...</DashboardContent>;
  }

  if (error) {
    return <DashboardContent>Error loading data</DashboardContent>;
  }

  // Lấy danh sách các studentId duy nhất
  const studentIds = Array.isArray(data) ? Array.from(new Set(data.map((d) => d.user_id))) : [];

  // Nếu chưa chọn, mặc định chọn studentId đầu tiên
  const currentId = selectedId || (studentIds.length > 0 ? studentIds[0] : '');

  if (!currentId) {
    return <DashboardContent>Không có dữ liệu học viên.</DashboardContent>;
  }

  return (
    <>
      <title>Student - Dashboard</title>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel id="student-select-label">Chọn học viên</InputLabel>
          <Select
            labelId="student-select-label"
            value={currentId}
            label="Chọn học viên"
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {studentIds.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <StudentDashboardView data={data || []} studentId={currentId} />
    </>
  );
}
