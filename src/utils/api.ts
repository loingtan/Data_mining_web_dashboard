import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://pnqljxlcqfeubrtfrbvv.supabase.co/functions/v1';
const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucWxqeGxjcWZldWJydGZyYnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzg1MjgsImV4cCI6MjA2MjcxNDUyOH0.3i_FHI-DFUXQUdSOuZFtxdH4GwRzv8FVb-9jD9G7TYM';

// API Endpoints
const ENDPOINTS = {
  USER_PROFILE: `${BASE_URL}/get-user-profile`,
  COURSE_WEEK_PROFILES: `${BASE_URL}/get-course-and-week-profiles`,
  USER_ACTIVITY: `${BASE_URL}/query-week-table`,
  MODELS: `${BASE_URL}/query-models-db`,
  TEST_PREDICTIONS: `${BASE_URL}/query-test-predictions`,
  PREDICT: `${BASE_URL}/predict`,
} as const;

// TypeScript interfaces
export interface UserProfile {
  user_id: string;
  name: string;
  gender: number;
  school: string;
  year_of_birth: number | null;
}

export interface UserProfileResponse {
  message: string;
  profiles: UserProfile[];
}

export interface Course {
  id: string;
  name: string;
  field: string;
  prerequisites: string | null;
}

export interface CourseResponse {
  message: string;
  courses: Course[];
}

export interface UserActivity {
  user_id: string;
  course_id: string;
  completion: number;
  gender: number | null;
  year_of_birth: number | null;
  user_school_encoded: number | null;
  student_num_course_order: number | null;
  course_num_teacher: number;
  course_num_school: number;
  course_field_encoded: number;
  course_prerequisites_encoded: number;
  course_num_videos: number;
  course_num_exercises: number;
  course_num_problems: number;
  course_num_students: number;
  course_total_default_video_time: number;
  course_total_comments: number;
  course_total_replies: number;
  course_avg_comments_per_student: number;
  course_avg_replies_per_student: number;
  course_total_problem_attempts: number;
  course_avg_problem_attempts_per_student: number;
  course_total_completion_rate: number;
  course_avg_completion_rate: string;
  course_total_video_watch_time: string;
  course_avg_video_watch_time_per_student: string;
  problem_days_since_enroll: number | null;
  video_days_since_enroll: number | null;
  comment_days_since_enroll: string;
  reply_days_since_enroll: string;
  'student_num_course_order.1': number | null;
  problem_type: number | null;
  problem_language_encoded: number | null;
  problem_num_options: number | null;
  problem_typetext_encoded: number | null;
  problem_chapter: number | null;
  problem_index: number | null;
  // Week 1-4 data
  ex_do_week1: number | null;
  problem_done_week1: number | null;
  total_correct_answer_week1: number | null;
  total_attempt_week1: number | null;
  problem_do_maxscore_week1: number | null;
  total_score_week1: number | null;
  total_video_watching_week1: number | null;
  video_watching_speed_week1: number | null;
  video_watching_duration_week1: number | null;
  comment_count_week1: string;
  reply_count_week1: string;
  ex_do_week2: number | null;
  problem_done_week2: number | null;
  total_correct_answer_week2: number | null;
  total_attempt_week2: number | null;
  problem_do_maxscore_week2: number | null;
  total_score_week2: number | null;
  total_video_watching_week2: number | null;
  video_watching_speed_week2: number | null;
  video_watching_duration_week2: number | null;
  comment_count_week2: string;
  reply_count_week2: string;
  ex_do_week3: number | null;
  problem_done_week3: number | null;
  total_correct_answer_week3: number | null;
  total_attempt_week3: number | null;
  problem_do_maxscore_week3: number | null;
  total_score_week3: number | null;
  total_video_watching_week3: number | null;
  video_watching_speed_week3: number | null;
  video_watching_duration_week3: number | null;
  comment_count_week3: string;
  reply_count_week3: string;
  ex_do_week4: number | null;
  problem_done_week4: number | null;
  total_correct_answer_week4: number | null;
  total_attempt_week4: number | null;
  problem_do_maxscore_week4: number | null;
  total_score_week4: number | null;
  total_video_watching_week4: number | null;
  video_watching_speed_week4: number | null;
  video_watching_duration_week4: number | null;
  comment_count_week4: string;
  reply_count_week4: string;
  alpha: string;
}

export interface PredictionModel {
  model_id: number;
  model_name: string;
  model_version: string;
  algorithm_used: string;
  week: number;
  performance_metrics_json: string;
  feature_importance_json: string;
  hyperparameters_json: string;
  is_active: string;
}

export interface PerformanceMetrics {
  test: {
    rmse: number;
    mae: number;
    r2: number;
    mape: number;
  };
  train: {
    rmse: number;
    mae: number;
    r2: number;
    mape: number;
  };
}

export interface FeatureImportance {
  [feature: string]: number;
}

export interface Hyperparameters {
  [param: string]: any;
}

export interface TestPrediction {
  user_id: string;
  course_id: string;
  actual_completion: number;
  predicted_completion: number;
  model_id: number;
  output_predict_json: string;
  set_type: string;
  prediction_id: string;
}

export interface PredictionRequest {
  model_id: number;
  user_id: string;
  course_id: string;
  problem_chapter: number;
  total_correct_answer_week1: number;
  problem_index: number;
  course_num_problems: number;
  problem_type: number;
  course_num_videos: number;
  problem_done_week1: number;
}

export interface PredictionResponse {
  predicted_completion: number;
  confidence: number;
  model_info: {
    model_id: number;
    model_name: string;
    algorithm_used: string;
  };
}

// API Functions
export const fetchUserProfiles = async (userId?: string): Promise<UserProfileResponse> => {
  const body = userId ? { user_id: userId } : { name: 'Functions' };

  const response = await fetch(ENDPOINTS.USER_PROFILE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profiles from API');
  }

  return response.json();
};

export const fetchCourses = async (courseId?: string): Promise<CourseResponse> => {
  const body = courseId ? { id: courseId } : { name: 'Functions' };

  const response = await fetch(ENDPOINTS.COURSE_WEEK_PROFILES, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch courses from API');
  }

  return response.json();
};

export const fetchPredictionModels = async (): Promise<PredictionModel[]> => {
  const response = await fetch(ENDPOINTS.MODELS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ name: 'Functions' }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prediction models from API');
  }

  return response.json();
};

export const fetchUserActivity = async (): Promise<UserActivity[]> => {
  const response = await fetch(ENDPOINTS.USER_ACTIVITY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ name: 'Functions' }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user activity from API');
  }

  return response.json();
};

export const fetchTestPredictions = async (modelId?: number | null): Promise<TestPrediction[]> => {
  const body = modelId ? { model_id: modelId } : { name: 'Functions' };

  const response = await fetch(ENDPOINTS.TEST_PREDICTIONS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch test predictions from API');
  }

  return response.json();
};

export const fetchPrediction = async (request: PredictionRequest): Promise<PredictionResponse> => {
  const response = await fetch(ENDPOINTS.PREDICT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prediction from API');
  }

  return response.json();
};

// React Query Hooks
export const useUserProfiles = (userId?: string) =>
  useQuery<UserProfileResponse>({
    queryKey: ['userProfiles', userId],
    queryFn: () => fetchUserProfiles(userId),
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

export const useCourses = (courseId?: string) =>
  useQuery<CourseResponse>({
    queryKey: ['courses', courseId],
    queryFn: () => fetchCourses(courseId),
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

export const useUserActivity = () =>
  useQuery<UserActivity[]>({
    queryKey: ['userActivity'],
    queryFn: fetchUserActivity,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

export const usePredictionModels = () =>
  useQuery<PredictionModel[]>({
    queryKey: ['predictionModels'],
    queryFn: fetchPredictionModels,
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

export const useTestPredictions = (modelId?: number | null) =>
  useQuery<TestPrediction[]>({
    queryKey: ['testPredictions', modelId],
    queryFn: () => fetchTestPredictions(modelId),
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
  });

// Hook for making predictions with mutation
export const usePrediction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PredictionResponse | null>(null);

  const predict = async (request: PredictionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchPrediction(request);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi thực hiện dự đoán';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    predict,
    reset,
    isLoading,
    error,
    data,
  };
};
