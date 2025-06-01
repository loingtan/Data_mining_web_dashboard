import { useState } from 'react';

import { Box } from '@mui/system';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import { useCourses, useUserProfiles, useUserActivity } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard/content';

import { StudentDashboardView } from 'src/sections/student/view/student-dashboard-view';

export default function StudentPage() {
  const {
    data: userProfilesResponse,
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useUserProfiles();
  const { isLoading: isLoadingCourses, error: errorCourses } = useCourses();
  const {
    data: userActivityResponse,
    isLoading: isLoadingActivity,
    error: errorActivity,
  } = useUserActivity();
  const [selectedId, setSelectedId] = useState('');

  const isLoading = isLoadingUsers || isLoadingCourses || isLoadingActivity;
  const error = errorUsers || errorCourses || errorActivity;

  if (isLoading) {
    return <DashboardContent>Đang tải dữ liệu học viên...</DashboardContent>;
  }

  if (error) {
    return <DashboardContent>Error loading data</DashboardContent>;
  }

  const users = userProfilesResponse?.profiles || [];
  const activities = userActivityResponse || [];

  // Get list of unique student IDs from activities
  const studentIds = Array.from(new Set(activities.map((activity) => activity.user_id)));

  // If not selected, default to first studentId
  const currentId = selectedId || (studentIds.length > 0 ? studentIds[0] : '');

  if (!currentId) {
    return <DashboardContent>Không có dữ liệu học viên.</DashboardContent>;
  }

  // Filter activities for the selected student and map to UserActivity format
  const studentActivities = activities.filter((activity) => activity.user_id === currentId);

  return (
    <>
      <title>Student - Dashboard</title>
      <DashboardContent>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="student-select-label">Chọn học viên</InputLabel>
            <Select
              labelId="student-select-label"
              value={currentId}
              label="Chọn học viên"
              onChange={(e) => setSelectedId(e.target.value as string)}
            >
              {studentIds.map((id) => {
                const user = users.find((u) => u.user_id === id);
                return (
                  <MenuItem key={id} value={id}>
                    {user?.name || id}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <StudentDashboardView data={studentActivities} studentId={currentId} />
      </DashboardContent>
    </>
  );
}
