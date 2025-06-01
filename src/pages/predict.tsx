import { useMemo } from 'react';

import { useCourses, useUserActivity, useUserProfiles } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard/content';

import { PredictView } from 'src/sections/predict/view/predict-view';

// Interface for transformed prediction data
export interface PredictData {
  student_id: string;
  student_name: string;
  course_name: string;
  completion: number;
  video_completion_rate: number;
  problem_completion_rate: number;
  total_time_spent: number;
  course_num_students: number;
  course_avg_completion: number;
  week_1_video_time: number;
  week_1_problem_score: number;
  week_2_video_time: number;
  week_2_problem_score: number;
  week_3_video_time: number;
  week_3_problem_score: number;
  week_4_video_time: number;
  week_4_problem_score: number;
  week_5_video_time: number;
  week_5_problem_score: number;
  week_6_video_time: number;
  week_6_problem_score: number;
  week_7_video_time: number;
  week_7_problem_score: number;
  week_8_video_time: number;
  week_8_problem_score: number;
  week_9_video_time: number;
  week_9_problem_score: number;
  week_10_video_time: number;
  week_10_problem_score: number;
  week_11_video_time: number;
  week_11_problem_score: number;
  week_12_video_time: number;
  week_12_problem_score: number;
}

export default function PredictPage() {
  const {
    data: userActivityData,
    isLoading: activityLoading,
    error: activityError,
  } = useUserActivity();
  const {
    data: userProfilesData,
    isLoading: profilesLoading,
    error: profilesError,
  } = useUserProfiles();
  const { data: coursesData, isLoading: coursesLoading, error: coursesError } = useCourses();

  const transformedData = useMemo(() => {
    if (!userActivityData || !userProfilesData?.profiles || !coursesData?.courses) {
      return [];
    }

    return userActivityData.map((activity) => {
      // Find user profile and course information
      const userProfile = userProfilesData.profiles.find((p) => p.user_id === activity.user_id);
      const course = coursesData.courses.find((c) => c.id === activity.course_id);

      // Calculate derived metrics

      // Calculate completion rates based on available week data
      const videoCompletionRate = activity.completion || 0; // Use completion as proxy
      const problemCompletionRate = activity.completion || 0; // Use completion as proxy

      // Calculate total time spent (sum of all video watching time)
      const totalTimeSpent =
        (activity.total_video_watching_week1 || 0) +
        (activity.total_video_watching_week2 || 0) +
        (activity.total_video_watching_week3 || 0) +
        (activity.total_video_watching_week4 || 0);

      const predictData: PredictData = {
        student_id: activity.user_id,
        student_name: userProfile?.name || `Student ${activity.user_id}`,
        course_name: course?.name || `Course ${activity.course_id}`,
        completion: activity.completion,
        video_completion_rate: videoCompletionRate,
        problem_completion_rate: problemCompletionRate,
        total_time_spent: totalTimeSpent,
        course_num_students: activity.course_num_students,
        course_avg_completion: parseFloat(activity.course_avg_completion_rate) || 0,
        // Week data
        week_1_video_time: activity.total_video_watching_week1 || 0,
        week_1_problem_score: activity.total_score_week1 || 0,
        week_2_video_time: activity.total_video_watching_week2 || 0,
        week_2_problem_score: activity.total_score_week2 || 0,
        week_3_video_time: activity.total_video_watching_week3 || 0,
        week_3_problem_score: activity.total_score_week3 || 0,
        week_4_video_time: activity.total_video_watching_week4 || 0,
        week_4_problem_score: activity.total_score_week4 || 0,
        // For weeks 5-12, we'll use default values since the API only has weeks 1-4
        week_5_video_time: 0,
        week_5_problem_score: 0,
        week_6_video_time: 0,
        week_6_problem_score: 0,
        week_7_video_time: 0,
        week_7_problem_score: 0,
        week_8_video_time: 0,
        week_8_problem_score: 0,
        week_9_video_time: 0,
        week_9_problem_score: 0,
        week_10_video_time: 0,
        week_10_problem_score: 0,
        week_11_video_time: 0,
        week_11_problem_score: 0,
        week_12_video_time: 0,
        week_12_problem_score: 0,
      };

      return predictData;
    });
  }, [userActivityData, userProfilesData, coursesData]);

  const isLoading = activityLoading || profilesLoading || coursesLoading;
  const error = activityError || profilesError || coursesError;

  if (isLoading) {
    return <DashboardContent>Đang tải dữ liệu dự đoán...</DashboardContent>;
  }

  if (error) {
    return <DashboardContent>Lỗi khi tải dữ liệu từ API</DashboardContent>;
  }

  return (
    <>
      <title>Predict - Dashboard</title>
      <PredictView data={transformedData} />
    </>
  );
}
