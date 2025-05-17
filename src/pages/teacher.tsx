import type { UserCompletion } from 'src/utils/api';

import { useUserCompletion } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard/content';

import { TeacherDashboardView } from 'src/sections/teacher/view/teacher-dashboard-view';

export default function TeacherPage() {
  const { data, isLoading, error } = useUserCompletion();

  if (isLoading) {
    return <DashboardContent>Đang tải dữ liệu...</DashboardContent>;
  }

  if (error) {
    return <DashboardContent>Error loading data</DashboardContent>;
  }

  return (
    <>
      <title>Teacher - Dashboard</title>
      <TeacherDashboardView data={data as UserCompletion[]} />
    </>
  );
}
