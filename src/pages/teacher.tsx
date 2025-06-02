import { useCourses, useUserActivity, useUserProfiles } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard/content';

import { TeacherDashboardView } from 'src/sections/teacher/view/teacher-dashboard-view';

export default function TeacherPage() {
  const { data: coursesResponse, isLoading: isLoadingCourses, error: errorCourses } = useCourses();
  const {
    data: userActivityResponse,
    isLoading: isLoadingActivity,
    error: errorActivity,
  } = useUserActivity();
  const {
    data: userProfilesResponse,
    isLoading: isLoadingProfiles,
    error: errorProfiles,
  } = useUserProfiles();

  const isLoading = isLoadingCourses || isLoadingActivity || isLoadingProfiles;
  const error = errorCourses || errorActivity || errorProfiles;

  if (isLoading) {
    return <DashboardContent>Đang tải dữ liệu...</DashboardContent>;
  }

  if (error) {
    return <DashboardContent>Error loading data</DashboardContent>;
  }

  // Transform user activity data for teacher dashboard
  const activities = userActivityResponse || [];
  const userProfiles = userProfilesResponse?.profiles || [];

  const teacherData = activities.map((activity) => {
    const course = coursesResponse?.courses.find((c) => c.id === activity.course_id);

    const filteredProfiles = userProfiles.filter((profile) => profile.user_id);
    const userProfile = filteredProfiles[Math.floor(Math.random() * filteredProfiles.length)];

    // Calculate total video watch time across all weeks
    const totalVideoTime = [
      activity.total_video_watching_week1,
      activity.total_video_watching_week2,
      activity.total_video_watching_week3,
      activity.total_video_watching_week4,
    ].reduce((sum, time) => (sum || 0) + (time || 0), 0);

    // Calculate total problems done across all weeks
    const totalProblems = [
      activity.problem_done_week1,
      activity.problem_done_week2,
      activity.problem_done_week3,
      activity.problem_done_week4,
    ].reduce((sum, problems) => (sum || 0) + (problems || 0), 0);

    // Calculate total video views (count of videos watched across all weeks)
    const totalVideoViews = [
      activity.ex_do_week1,
      activity.ex_do_week2,
      activity.ex_do_week3,
      activity.ex_do_week4,
    ].reduce((sum, views) => (sum || 0) + (views || 0), 0);

    return {
      course_id: activity.course_id,
      course_name: course?.name || `Course ${activity.course_id}`,
      user_id: activity.user_id,
      student_name: userProfile?.name || `Student ${activity.user_id}`,
      student_email: userProfile
        ? `${userProfile.user_id}@university.edu`
        : `${activity.user_id}@university.edu`,
      gender: userProfile?.gender === 0 ? 'Female' : userProfile?.gender === 1 ? 'Male' : 'Unknown',
      school: userProfile?.school || 'Unknown',
      year_of_birth: userProfile?.year_of_birth || null,
      video_completion: (activity.completion || 0).toFixed(2),
      problem_completion: (
        (totalProblems || 0) / Math.max(activity.course_num_problems || 1, 1)
      ).toFixed(2),
      user_total_video_views: totalVideoViews || 0,
      user_total_video_watch_time: totalVideoTime || 0,
    };
  });

  return (
    <>
      <title>Teacher - Dashboard</title>
      <TeacherDashboardView data={teacherData} />
    </>
  );
}
