import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { useUserCompletion } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

// Note: There are TypeScript errors with the Grid component's item prop,
// but the component works correctly at runtime. This is a known issue
// with Material-UI's type definitions.

// Định nghĩa kiểu dữ liệu (phù hợp với dataset_final.json)
type DataRow = {
  user_id: string;
  course_id: string;
  video_completion: number;
  problem_completion: number;
  alpha: number;
  completion: number;
  num_videos: number;
  num_problems: number;
  num_teacher: number;
  num_school: number;
  field_encoded: number | null;
  prerequisites_encoded: number | null;
  num_exercises: number;
  num_students: number;
  total_default_video_time: number;
  total_comments: number;
  total_replies: number;
  avg_comments_per_student: number;
  avg_replies_per_student: number;
  total_problem_attempts: number;
  avg_problem_attempts_per_student: number;
  course_total_completion_rate: number;
  course_avg_completion_rate: number;
  total_video_watch_time: number;
  avg_video_watch_time_per_student: number;
  problem_iscorrect_ratio: number;
  problem_attempts_ratio: number;
  problem_score_ratio: number;
  problem_lang_ratio: number;
  problem_option_ratio: number;
  problem_type_ratio: number;
  user_total_video_watch_time: number;
  user_avg_video_watch_time: number;
  video_watched: number;
};

type Props = {
  data: DataRow[];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Add hover effects and transitions to cards
const cardStyles = {
  height: '100%',
  boxShadow: 3,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 6,
  },
};

// Add gradient backgrounds to stat cards
const statCardStyles = {
  ...cardStyles,
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
  '&:hover': {
    ...cardStyles['&:hover'],
    background: 'linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%)',
  },
};

// Add animation to progress bars
const progressStyles = {
  height: 8,
  borderRadius: 1,
  transition: 'width 0.5s ease-in-out',
  '& .MuiLinearProgress-bar': {
    transition: 'transform 0.5s ease-in-out',
  },
};

// Add utility functions for data processing
const calculateAverage = (data: number[]) => {
  if (!data.length) return 0;
  return data.reduce((sum, val) => sum + val, 0) / data.length;
};

const formatNumber = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

const formatPercentage = (num: number) => `${Math.round(num * 100)}%`;

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return hours > 0 ? `${hours} giờ ${mins} phút` : `${mins} phút`;
};

export function HomeView() {
  const [selectedMetric, setSelectedMetric] = useState('completion');
  const { data, isLoading, error } = useUserCompletion();
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgCompletion: 0,
    avgVideoWatchTime: 0,
    avgProblemAttempts: 0,
    totalCourses: 0,
    totalTeachers: 0,
    totalSchools: 0,
    totalExercises: 0,
    avgCommentsPerStudent: 0,
    avgRepliesPerStudent: 0,
    avgProblemScore: 0,
    totalVideoWatchTime: 0,
  });

  useEffect(() => {
    if (data) {
      try {
        // Calculate basic statistics
        const totalStudents = data.reduce((sum, row) => sum + (row.num_students || 0), 0);
        const totalTeachers = data.reduce((sum, row) => sum + (row.num_teacher || 0), 0);
        const totalSchools = data.reduce((sum, row) => sum + (row.num_school || 0), 0);
        const totalExercises = data.reduce((sum, row) => sum + (row.num_exercises || 0), 0);
        const totalVideoWatchTime = data.reduce(
          (sum, row) => sum + (row.total_video_watch_time || 0),
          0
        );

        // Calculate averages
        const avgCompletion = calculateAverage(data.map((row) => row.completion || 0));
        const avgVideoWatchTime = calculateAverage(
          data.map((row) => row.avg_video_watch_time_per_student || 0)
        );
        const avgProblemAttempts = calculateAverage(
          data.map((row) => row.avg_problem_attempts_per_student || 0)
        );
        const avgCommentsPerStudent = calculateAverage(
          data.map((row) => row.avg_comments_per_student || 0)
        );
        const avgRepliesPerStudent = calculateAverage(
          data.map((row) => row.avg_replies_per_student || 0)
        );
        const avgProblemScore = calculateAverage(data.map((row) => row.problem_score_ratio || 0));

        setStats({
          totalStudents,
          avgCompletion,
          avgVideoWatchTime,
          avgProblemAttempts,
          totalCourses: data.length,
          totalTeachers,
          totalSchools,
          totalExercises,
          avgCommentsPerStudent,
          avgRepliesPerStudent,
          avgProblemScore,
          totalVideoWatchTime,
        });
      // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        console.error('Error processing data:', error);
      }
    }
  }, [data]);

  // Prepare chart data with null checks
  const completionData = [
    { name: 'Hoàn thành', value: Math.round(stats.avgCompletion * 100) },
    { name: 'Chưa hoàn thành', value: Math.round((1 - stats.avgCompletion) * 100) },
  ];

  const performanceData = [
    { name: 'Video', value: Math.round(stats.avgVideoWatchTime) },
    { name: 'Bài tập', value: Math.round(stats.avgProblemAttempts) },
    { name: 'Tương tác', value: Math.round(stats.avgCommentsPerStudent) },
    { name: 'Điểm số', value: Math.round(stats.avgProblemScore * 100) },
  ];

  // Calculate trend data from actual data if available
  const trendData =
    data && data.length > 0
      ? data.slice(-4).map((row, index) => ({
          name: `Tuần ${index + 1}`,
          video: Math.round(row.avg_video_watch_time_per_student || 0),
          exercise: Math.round(row.avg_problem_attempts_per_student || 0),
          interaction: Math.round(row.avg_comments_per_student || 0),
        }))
      : [
          { name: 'Tuần 1', video: 65, exercise: 45, interaction: 30 },
          { name: 'Tuần 2', video: 75, exercise: 55, interaction: 40 },
          { name: 'Tuần 3', video: 85, exercise: 65, interaction: 50 },
          { name: 'Tuần 4', video: 90, exercise: 75, interaction: 60 },
        ];

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
        </Alert>
      </Box>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header Section with enhanced styling */}
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Chào mừng đến với Hệ thống Dự đoán Học tập 👋
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Phân tích và dự đoán hành vi học tập của học viên để tối ưu hóa trải nghiệm học tập
            </Typography>
          </Box>

          {/* Quick Stats with enhanced cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
            }}
          >
            <Card sx={statCardStyles}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Tổng học viên
                  </Typography>
                  <Iconify icon="solar:pen-bold" width={32} sx={{ color: 'primary.main' }} />
                </Stack>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {formatNumber(stats.totalStudents)}
                </Typography>
                <LinearProgress variant="determinate" value={100} sx={progressStyles} />
              </CardContent>
            </Card>

            <Card sx={statCardStyles}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Tỷ lệ hoàn thành
                  </Typography>
                  <Iconify icon="solar:eye-bold" width={32} sx={{ color: 'primary.main' }} />
                </Stack>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {formatPercentage(stats.avgCompletion)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.avgCompletion * 100}
                  sx={progressStyles}
                />
              </CardContent>
            </Card>

            <Card sx={statCardStyles}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Thời gian xem video
                  </Typography>
                  <Iconify icon="solar:share-bold" width={32} sx={{ color: 'primary.main' }} />
                </Stack>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {formatDuration(stats.avgVideoWatchTime)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.avgVideoWatchTime / 60) * 100}
                  sx={progressStyles}
                />
              </CardContent>
            </Card>

            <Card sx={statCardStyles}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Bài tập đã làm
                  </Typography>
                  <Iconify icon="solar:cart-3-bold" width={32} sx={{ color: 'primary.main' }} />
                </Stack>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {formatNumber(Math.round(stats.avgProblemAttempts))}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(stats.avgProblemAttempts / 10) * 100}
                  sx={progressStyles}
                />
              </CardContent>
            </Card>
          </Box>

          {/* Additional Stats */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
            }}
          >
            <Card sx={cardStyles}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Tổng khóa học
                  </Typography>
                  <Iconify icon="solar:cart-3-bold" width={32} sx={{ color: 'primary.main' }} />
                </Stack>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {stats.totalCourses}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={cardStyles}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Tổng giảng viên
                  </Typography>
                  <Iconify icon="solar:restart-bold" width={32} sx={{ color: 'primary.main' }} />
                </Stack>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {stats.totalTeachers}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={cardStyles}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Tổng trường học
                  </Typography>
                  <Iconify icon="solar:eye-closed-bold" width={32} sx={{ color: 'primary.main' }} />
                </Stack>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {stats.totalSchools}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={cardStyles}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 3 }}
                >
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Tổng bài tập
                  </Typography>
                  <Iconify icon="solar:pen-bold" width={32} sx={{ color: 'primary.main' }} />
                </Stack>
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {stats.totalExercises}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Charts Section with enhanced styling */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4,
            }}
          >
            <Card sx={cardStyles}>
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: 'primary.main',
                  }}
                >
                  Tỷ lệ hoàn thành khóa học
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={completionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {completionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card sx={cardStyles}>
              <CardContent>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: 'primary.main',
                  }}
                >
                  Chỉ số hiệu suất học tập
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Trend Analysis */}
          <Card sx={cardStyles}>
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                Phân tích xu hướng học tập
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="video" stroke="#8884d8" name="Video" />
                  <Line type="monotone" dataKey="exercise" stroke="#82ca9d" name="Bài tập" />
                  <Line type="monotone" dataKey="interaction" stroke="#ffc658" name="Tương tác" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Features Section with enhanced styling */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}
          >
            <Card sx={cardStyles}>
              <CardContent>
                <Stack spacing={3}>
                  <Iconify
                    icon="solar:cart-3-bold"
                    width={48}
                    sx={{
                      color: 'primary.main',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                    }}
                  >
                    Phân tích dữ liệu
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    Phân tích chi tiết hành vi học tập của học viên thông qua các chỉ số quan trọng
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={cardStyles}>
              <CardContent>
                <Stack spacing={3}>
                  <Iconify
                    icon="solar:pen-bold"
                    width={48}
                    sx={{
                      color: 'primary.main',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                    }}
                  >
                    Dự đoán thông minh
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    Sử dụng AI để dự đoán kết quả học tập và đề xuất cải thiện
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card sx={cardStyles}>
              <CardContent>
                <Stack spacing={3}>
                  <Iconify
                    icon="solar:share-bold"
                    width={48}
                    sx={{
                      color: 'primary.main',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                    }}
                  >
                    Báo cáo chi tiết
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.6,
                    }}
                  >
                    Tạo báo cáo chi tiết về tiến độ và hiệu suất học tập của học viên
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Action Buttons with enhanced styling */}
          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            sx={{
              py: 4,
              '& .MuiButton-root': {
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              },
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Iconify icon="solar:pen-bold" width={32} />}
              onClick={() => setSelectedMetric('completion')}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                },
              }}
            >
              Xem chi tiết
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Iconify icon="solar:cart-3-bold" width={24} />}
              sx={{
                px: 4,
                py: 1.5,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Tải báo cáo
            </Button>
          </Stack>
        </Stack>
      </Container>
    </DashboardContent>
  );
}
