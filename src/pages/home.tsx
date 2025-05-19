import { HomeView } from 'src/sections/home/view/home-view';

const dataset = [
  {
    user_id: '1',
    course_id: '1',
    video_completion: 0.5,
    problem_completion: 0.3,
    alpha: 0.7,
    completion: 0.6,
    num_videos: 10,
    num_problems: 20,
    num_teacher: 2,
    num_school: 1,
    field_encoded: 1,
    prerequisites_encoded: 1,
    num_exercises: 15,
    num_students: 100,
    total_default_video_time: 120,
    total_comments: 50,
    total_replies: 30,
    avg_comments_per_student: 0.5,
    avg_replies_per_student: 0.3,
    total_problem_attempts: 200,
    avg_problem_attempts_per_student: 2,
    course_total_completion_rate: 0.7,
    course_avg_completion_rate: 0.65,
    total_video_watch_time: 600,
    avg_video_watch_time_per_student: 6,
    problem_iscorrect_ratio: 0.8,
    problem_attempts_ratio: 0.9,
    problem_score_ratio: 0.85,
    problem_lang_ratio: 0.95,
    problem_option_ratio: 0.9,
    problem_type_ratio: 0.85,
    user_total_video_watch_time: 60,
    user_avg_video_watch_time: 6,
    video_watched: 0.5,
  },
];

export default function HomePage() {
  return (
    <>
      <title>Trang chủ - Hệ thống dự đoán kết quả học tập</title>
      <HomeView />
    </>
  );
}
