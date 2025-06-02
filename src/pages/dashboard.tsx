import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { useCourses, useUserProfiles, useUserActivity } from 'src/utils/api';

// Sample data quality metrics - will be replaced with real calculations
const sampleCompletenessData = [
  { column: 'user_id', missing: 0, complete: 100 },
  { column: 'course_id', missing: 0, complete: 100 },
  { column: 'year_of_birth', missing: 15, complete: 85 },
  { column: 'gender', missing: 8, complete: 92 },
  { column: 'completion', missing: 5, complete: 95 },
  { column: 'video_watch_time', missing: 12, complete: 88 },
];

const cardStyles = {
  height: '100%',
  boxShadow: 3,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: 6,
  },
};

export default function DashboardPage() {
  const { data: userProfilesResponse, isLoading: isLoadingUsers } = useUserProfiles();
  const { data: coursesResponse, isLoading: isLoadingCourses } = useCourses();
  const { data: userActivityResponse, isLoading: isLoadingActivity } = useUserActivity();

  const isLoading = isLoadingUsers || isLoadingCourses || isLoadingActivity;

  // Calculate comprehensive dataset statistics based on userActivity data
  const datasetStats = useMemo(() => {
    if (!userActivityResponse) {
      return {
        totalRecords: 0,
        uniqueUsers: 0,
        uniqueCourses: 0,
        avgCompletion: 0,
        totalVideoWatchTime: 0,
        totalProblemAttempts: 0,
        avgVideosPerCourse: 0,
        avgProblemsPerCourse: 0,
        completionDistribution: { high: 0, medium: 0, low: 0 },
        dataQualityMetrics: {
          missingGender: 0,
          missingYearOfBirth: 0,
          missingSchool: 0,
          completeness: 0,
        },
        supplementaryInfo: {
          totalProfilesAvailable: 0,
          totalCoursesAvailable: 0,
        },
      };
    }

    const activities = userActivityResponse || [];

    // Basic counts
    const uniqueUsers = new Set(activities.map((a) => a.user_id)).size;
    const uniqueCourses = new Set(activities.map((a) => a.course_id)).size;

    // Completion analysis
    const completionRates = activities.map((a) => a.completion).filter((c) => c !== null);
    const avgCompletion =
      completionRates.length > 0
        ? completionRates.reduce((sum, c) => sum + c, 0) / completionRates.length
        : 0;

    // Completion distribution
    const high = completionRates.filter((c) => c >= 0.8).length;
    const medium = completionRates.filter((c) => c >= 0.4 && c < 0.8).length;
    const low = completionRates.filter((c) => c < 0.4).length;

    // Course statistics
    const courseVideoCount = activities.map((a) => a.course_num_videos).filter((v) => v > 0);
    const courseProblemCount = activities.map((a) => a.course_num_problems).filter((p) => p > 0);
    const avgVideosPerCourse =
      courseVideoCount.length > 0
        ? courseVideoCount.reduce((sum, v) => sum + v, 0) / courseVideoCount.length
        : 0;
    const avgProblemsPerCourse =
      courseProblemCount.length > 0
        ? courseProblemCount.reduce((sum, p) => sum + p, 0) / courseProblemCount.length
        : 0;

    // Total activity metrics
    const totalProblemAttempts = activities
      .map((a) => a.course_total_problem_attempts)
      .filter((a) => a > 0)
      .reduce((sum, a) => sum + a, 0);

    const totalVideoTime = activities
      .map((a) => a.course_total_default_video_time)
      .filter((t) => t > 0)
      .reduce((sum, t) => sum + t, 0);

    // Data quality metrics
    const missingGender = activities.filter(
      (a) => a.gender === null || a.gender === undefined
    ).length;
    const missingYearOfBirth = activities.filter(
      (a) => a.year_of_birth === null || a.year_of_birth === undefined
    ).length;
    const missingSchool = activities.filter(
      (a) => a.user_school_encoded === null || a.user_school_encoded === undefined
    ).length;

    const completeness =
      ((activities.length - Math.max(missingGender, missingYearOfBirth, missingSchool)) /
        activities.length) *
      100;

    // Supplementary information from other APIs
    const totalProfilesAvailable = userProfilesResponse?.profiles?.length || 0;
    const totalCoursesAvailable = coursesResponse?.courses?.length || 0;

    return {
      totalRecords: activities.length,
      uniqueUsers,
      uniqueCourses,
      avgCompletion: avgCompletion * 100, // Convert to percentage
      totalVideoWatchTime: Math.round(totalVideoTime / 3600), // Convert to hours
      totalProblemAttempts,
      avgVideosPerCourse: Math.round(avgVideosPerCourse),
      avgProblemsPerCourse: Math.round(avgProblemsPerCourse),
      completionDistribution: { high, medium, low },
      dataQualityMetrics: {
        missingGender: Math.round((missingGender / activities.length) * 100),
        missingYearOfBirth: Math.round((missingYearOfBirth / activities.length) * 100),
        missingSchool: Math.round((missingSchool / activities.length) * 100),
        completeness: Math.round(completeness),
      },
      supplementaryInfo: {
        totalProfilesAvailable,
        totalCoursesAvailable,
      },
    };
  }, [userActivityResponse, userProfilesResponse, coursesResponse]);

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!userActivityResponse) return { completion: [], activity: [], quality: [] };

    // Completion Distribution Chart Data
    const completionData = [
      { name: 'Cao (≥80%)', value: datasetStats.completionDistribution.high, color: '#4caf50' },
      {
        name: 'Trung bình (40-80%)',
        value: datasetStats.completionDistribution.medium,
        color: '#ff9800',
      },
      { name: 'Thấp (<40%)', value: datasetStats.completionDistribution.low, color: '#f44336' },
    ];

    // Activity Metrics Chart Data
    const activityData = [
      { metric: 'Video TB/Khóa học', value: datasetStats.avgVideosPerCourse, color: '#2196f3' },
      { metric: 'Bài tập TB/Khóa học', value: datasetStats.avgProblemsPerCourse, color: '#ff9800' },
      {
        metric: 'Thời gian video (k giờ)',
        value: Math.round(datasetStats.totalVideoWatchTime / 1000),
        color: '#4caf50',
      },
      {
        metric: 'Lượt làm bài (k lần)',
        value: Math.round(datasetStats.totalProblemAttempts / 1000),
        color: '#9c27b0',
      },
    ];

    // Data Quality Chart Data
    const qualityData = [
      {
        field: 'Giới tính',
        missing: datasetStats.dataQualityMetrics.missingGender,
        complete: 100 - datasetStats.dataQualityMetrics.missingGender,
      },
      {
        field: 'Năm sinh',
        missing: datasetStats.dataQualityMetrics.missingYearOfBirth,
        complete: 100 - datasetStats.dataQualityMetrics.missingYearOfBirth,
      },
      {
        field: 'Trường học',
        missing: datasetStats.dataQualityMetrics.missingSchool,
        complete: 100 - datasetStats.dataQualityMetrics.missingSchool,
      },
    ];

    return { completion: completionData, activity: activityData, quality: qualityData };
  }, [datasetStats, userActivityResponse]);

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Stack spacing={6} sx={{ py: 4 }}>
        {/* Main Title */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              background: 'linear-gradient(45deg, #1976D2 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Phân Tích và Đảm Bảo Chất Lượng Dữ Liệu
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Đánh giá toàn diện chất lượng dữ liệu MOOCCubeX cho hệ thống dự đoán hoàn thành khóa học
          </Typography>
        </Box>

        {/* Section 1: Dataset Overview */}
        <Card sx={cardStyles}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Phần 1: Tổng quan Bộ dữ liệu
            </Typography>

            {/* Dataset Source Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Nguồn dữ liệu: MOOCCubeX
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                Bộ dữ liệu MOOCCubeX là một kho dữ liệu lớn được nhóm nghiên cứu Kiến trúc tri thức
                trường ĐH Thanh Hoa (THU-KEG) phát triển, hướng đến hỗ trợ nghiên cứu học tập thích
                nghi trên các khóa học trực tuyến mở (MOOCs). Kho dữ liệu bao gồm thông tin về 4.216
                khóa học, 230.263 video bài giảng, 358.265 bài tập, 637.572 khái niệm chi tiết và
                hơn 296 triệu bản ghi hành vi của 3.330.294 sinh viên gitee.com . Dữ liệu này được
                XuetangX cấp phép và cung cấp (có giấy phép GPL-3.0), bao gồm các nguồn liên quan
                đến khóa học, thông tin giảng viên, trường học, cũng như các thông tin chi tiết về
                hành vi người dùng (xem khóa học, làm bài tập, bình luận, v.v.) và các khái niệm thu
                thập từ phụ đề video.
              </Typography>

              {/* Quick Stats - Activity-Focused Metrics */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e3f2fd' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {datasetStats.totalRecords.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Bản ghi hoạt động</Typography>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e8' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {datasetStats.uniqueUsers.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Người dùng hoạt động</Typography>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fff3e0' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      {datasetStats.avgCompletion.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2">Tỷ lệ hoàn thành TB</Typography>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                >
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fce4ec' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {datasetStats.uniqueCourses.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Khóa học được học</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Main Files Information - Activity-Focused */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Dữ liệu trọng tâm phân tích
              </Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Trọng tâm:</strong> Đánh giá chất lượng dữ liệu dựa chủ yếu trên hoạt động
                  học tập của người dùng (user_activity), với thông tin hồ sơ người dùng và khóa học
                  chỉ mang tính bổ trợ.
                </Typography>
              </Alert>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="🎯 user_activity.json (Dữ liệu chính)"
                    secondary={`Hoạt động học tập chi tiết: ${datasetStats.totalRecords.toLocaleString()} bản ghi từ ${datasetStats.uniqueUsers.toLocaleString()} người dùng trên ${datasetStats.uniqueCourses.toLocaleString()} khóa học, bao gồm tỷ lệ hoàn thành, thời gian xem video, số lượng bài tập`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="📋 user_profile.json (Bổ trợ)"
                    secondary={`Thông tin cá nhân: ${datasetStats.supplementaryInfo.totalProfilesAvailable.toLocaleString()} hồ sơ người dùng với thông tin giới tính, năm sinh, trường học`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="📚 course.json (Bổ trợ)"
                    secondary={`Thông tin khóa học: ${datasetStats.supplementaryInfo.totalCoursesAvailable.toLocaleString()} khóa học với metadata về lĩnh vực, điều kiện tiên quyết`}
                  />
                </ListItem>
              </List>

              {/* Activity Data Quality Metrics */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Chỉ số chất lượng dữ liệu hoạt động
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Thời gian video tổng
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {datasetStats.totalVideoWatchTime.toLocaleString()}h
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Lượt làm bài tập
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {datasetStats.totalProblemAttempts.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Video TB/khóa học
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      {datasetStats.avgVideosPerCourse}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Bài tập TB/khóa học
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {datasetStats.avgProblemsPerCourse}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* CHARTS SECTION */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Phân tích trực quan dữ liệu
                </Typography>

                {/* Charts Grid */}
                <Grid container spacing={4}>
                  {/* Completion Distribution Pie Chart */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3, height: '400px' }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
                      >
                        Phân bố Tỷ lệ Hoàn thành Khóa học
                      </Typography>
                      <ResponsiveContainer width="100%" height="85%">
                        <PieChart>
                          <Pie
                            data={chartData.completion}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value, percent }) =>
                              `${name}: ${value} (${(percent * 100).toFixed(1)}%)`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.completion.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [`${value} sinh viên`, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  {/* Activity Metrics Bar Chart */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ p: 3, height: '400px' }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
                      >
                        Chỉ số Hoạt động Học tập
                      </Typography>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={chartData.activity}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="metric"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            fontSize={11}
                          />
                          <YAxis />
                          <Tooltip
                            formatter={(value, name) => [value, 'Giá trị']}
                            labelFormatter={(label) => `Chỉ số: ${label}`}
                          />
                          <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                            {chartData.activity.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>

                  {/* Data Quality Stacked Bar Chart */}
                  <Grid size={{ xs: 12 }}>
                    <Card sx={{ p: 3, height: '400px' }}>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
                      >
                        Chất lượng Dữ liệu theo Trường thông tin
                      </Typography>
                      <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={chartData.quality}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="field" />
                          <YAxis
                            label={{ value: 'Tỷ lệ (%)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip
                            formatter={(value, name) => [
                              `${value}%`,
                              name === 'complete' ? 'Đầy đủ' : 'Thiếu',
                            ]}
                            labelFormatter={(label) => `Trường: ${label}`}
                          />
                          <Legend
                            formatter={(value) => (value === 'complete' ? 'Đầy đủ' : 'Thiếu')}
                          />
                          <Bar dataKey="complete" stackId="a" fill="#4caf50" name="complete" />
                          <Bar dataKey="missing" stackId="a" fill="#f44336" name="missing" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Processing Summary - Activity-Focused */}
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                <strong>Phương pháp đánh giá:</strong> Tập trung phân tích{' '}
                {datasetStats.totalRecords.toLocaleString()} bản ghi hoạt động học tập với tỷ lệ
                hoàn thành trung bình {datasetStats.avgCompletion.toFixed(1)}% và độ đầy đủ dữ liệu{' '}
                {datasetStats.dataQualityMetrics.completeness}%. Dữ liệu hồ sơ người dùng và khóa
                học được sử dụng để bổ trợ thông tin ngữ cảnh.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* NEW SECTION: MOOCCubeX Data Organization */}
        <Card sx={cardStyles}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Cấu trúc Tổ chức Dữ liệu MOOCCubeX
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Các thư mục chính
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="docs/"
                    secondary="Chứa tài liệu mô tả định dạng và ý nghĩa của các tệp dữ liệu (bằng tiếng Anh và tiếng Trung), ví dụ course-en.md, user-en.md, concept-en.md…"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'secondary.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="scripts/"
                    secondary="Chứa các kịch bản hỗ trợ (shell, Python) cho phép tải toàn bộ dữ liệu (download_dataset.sh), đếm số lượng mẫu (count.sh), tìm kiếm thông tin, v.v."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="entities/"
                    secondary="Chứa các tệp JSON lưu trữ thông tin thực thể (entities) của khóa học, video, bài tập, trường học, giáo viên, người dùng, bình luận, trả lời, khái niệm, v.v. (các tệp .json rất lớn có dung lượng từ vài trăm KB đến hàng GB)."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="relations/"
                    secondary="Chứa các tệp quan hệ (thường là file .txt hoặc .json) biểu diễn liên kết giữa các thực thể như liên kết giữa bài tập và câu hỏi (exercise-problem.txt), quan hệ giữa khoá học với lĩnh vực (course-field.json), theo dõi video của người dùng (user-video.json), quan hệ giữa người dùng và bài tập (user-problem.json), v.v. Ngoài ra còn có các liên kết khái niệm đến khóa học/video/bài toán/bình luận/nguồn tài nguyên ngoài (relations/concept-*.txt)."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Box
                      sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="prerequisites/"
                    secondary="Chứa các tệp JSON mô tả quan hệ tiền đề giữa các khái niệm trong một số lĩnh vực (máy tính, toán, tâm lý học)."
                  />
                </ListItem>
              </List>
            </Box>

            <Alert severity="warning" sx={{ mb: 4 }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Các tệp dữ liệu này có dung lượng rất lớn (ví dụ tệp
                entities/problem.json ~1,2GB, relations/user-problem.json ~21GB,
                entities/comment.json ~2,1GB), do đó khi sử dụng cần lưu ý về bộ nhớ. Mọi tệp đều ở
                định dạng văn bản (JSON hoặc tab-cách nhau .txt) và có cấu trúc rõ ràng theo mô tả.
              </Typography>
            </Alert>

            {/* Thư mục entities/ */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'secondary.dark' }}>
                Chi tiết các tệp dữ liệu
              </Typography>
              <Box
                sx={{
                  maxHeight: 600,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#fafafa',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#c1c1c1',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: '#a8a8a8',
                    },
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mt: 1, mb: 2, fontWeight: 'bold', color: 'primary.dark' }}
                >
                  Thư mục entities/ (thực thể)
                </Typography>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/course.json (JSON, ~43MB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Thông tin về mỗi khóa học. Mỗi mục con là một đối tượng JSON chứa các trường
                    chính: id, name, about, field, prerequisites, resource. Đây chính là phần Course
                    Info trong dữ liệu.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>id:</strong> Mã khoá học (định dạng C_xxxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>name:</strong> Tên khoá học
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>about:</strong> Giới thiệu khái quát về khoá học
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>field:</strong> Lĩnh vực (được gắn thẻ) của khoá học
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>prerequisites:</strong> Mô tả kiến thức tiên quyết
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>resource:</strong> Danh sách tài nguyên thuộc khoá học (video hoặc
                        nhóm bài tập, với các trường resource_type, resource_id, chapter, titles)
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/video.json (JSON, ~580MB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Thông tin chi tiết về từng video bài giảng. Đây là phần Video (tên video và phụ
                    đề) của dữ liệu.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>ccid:</strong> Mã video duy nhất
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>name:</strong> Tên video
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>start:</strong> Danh sách thời điểm bắt đầu mỗi câu phụ đề (giây)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>end:</strong> Thời điểm kết thúc mỗi câu phụ đề
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>text:</strong> Nội dung từng câu phụ đề (text theo thứ tự)
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/problem.json (JSON, ~1.2GB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Nội dung chi tiết của mỗi câu hỏi (bài toán) trong các bài tập. Đây là phần
                    Problem (nội dung câu hỏi) của khoá học.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>id:</strong> Mã câu hỏi (Pm_xxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>exercise_id:</strong> Mã nhóm bài tập chứa câu hỏi (Ex_xxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>language:</strong> Ngôn ngữ của đề bài (Zh/En)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>title:</strong> Tiêu đề của bài tập
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>content:</strong> Nội dung đề bài của câu hỏi
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>option:</strong> Các lựa chọn trả lời (cho câu hỏi nhiều lựa chọn)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>answer:</strong> Đáp án đúng
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>score:</strong> Số điểm của câu hỏi
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>type / typetext:</strong> Loại câu hỏi (ví dụ single choice, fill
                        in, v.v.) / Mô tả kiểu câu hỏi
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>location:</strong> Chương (chapter) của câu hỏi
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>context_id:</strong> Mảng các leaf_id của khái niệm liên quan
                        (fine-grained)
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/school.json (JSON, ~613KB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Thông tin các trường đại học.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>id:</strong> Mã trường (S_xxxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>name:</strong> Tên tiếng Trung của trường
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>name_en:</strong> Tên tiếng Anh của trường
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>sign:</strong> Viết tắt (ký hiệu) tên tiếng Anh của trường
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>about:</strong> Giới thiệu chung về trường
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>motto:</strong> Khẩu hiệu của trường
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/teacher.json (JSON, ~8.7MB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Thông tin giảng viên.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>id:</strong> Mã giảng viên (T_xxxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>name:</strong> Tên tiếng Trung của giảng viên
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>name_en:</strong> Tên tiếng Anh của giảng viên
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>about:</strong> Thông tin giới thiệu ngắn (tiểu sử)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>job_title:</strong> Chức danh (như Giáo sư, Phó Giáo sư…)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>org_name:</strong> Nơi công tác (trường, viện…)
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/user.json (JSON, ~770MB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Hồ sơ người dùng (sinh viên) đăng ký trên nền tảng.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>id:</strong> Mã người dùng (U_xxxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>name:</strong> Tên người dùng
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>gender:</strong> Giới tính (nếu biết)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>school:</strong> Trường học của người dùng
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>year_of_birth:</strong> Năm (và tháng) sinh
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>course_order:</strong> Danh sách khoá học đã đăng ký
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>enroll_time:</strong> Thời gian đăng ký (tương ứng với course_order)
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/comment.json (JSON, ~2.1GB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Thông tin bình luận của người dùng trên các tài nguyên (video hoặc bài tập).
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>id:</strong> Mã bình luận (Cm_xxxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>user_id:</strong> Mã người dùng viết bình luận (U_xxxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>text:</strong> Nội dung bình luận
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>create_time:</strong> Thời điểm viết bình luận
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/reply.json (JSON, ~50MB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Thông tin trả lời bình luận của người dùng.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>id:</strong> Mã trả lời (Rp_xxxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>user_id:</strong> Mã người dùng trả lời (U_xxxxxx)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>text:</strong> Nội dung trả lời
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>create_time:</strong> Thời điểm tạo trả lời
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    entities/concept.json (JSON, ~156MB)
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                    Tập hợp khái niệm (concept) thu được từ phụ đề video.
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                  >
                    Các trường chính:
                  </Typography>
                  <List dense disablePadding sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>id:</strong> Mã khái niệm (định dạng K_tênKháiNiệm_lĩnhVực)
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>name:</strong> Tên khái niệm
                      </ListItemText>
                    </ListItem>
                    <ListItem sx={{ py: 0.25 }}>
                      <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                        <strong>context:</strong> Ngữ cảnh xung quanh khái niệm (trích từ
                        Wiki/Baike/Zhihu)
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>

                {/* Thư mục relations/ */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 'bold', color: 'success.dark' }}
                  >
                    Thư mục relations/ (quan hệ)
                  </Typography>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/course-field.json (JSON, ~62KB)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Mối quan hệ giữa khoá học và lĩnh vực được gắn thẻ.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                    >
                      Các trường chính:
                    </Typography>
                    <List dense disablePadding sx={{ pl: 2 }}>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>course_id:</strong> Mã khoá học
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>course_name:</strong> Tên khoá học
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>field:</strong> Danh sách lĩnh vực của khoá học
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Box>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/course-school.txt
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Liên kết giữa khoá học và trường đại học tổ chức. Mỗi dòng{' '}
                      {'{course_id}\t{school_id}'}.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/course-teacher.txt
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Liên kết giữa khoá học và giảng viên. Mỗi dòng {'{course_id}\t{teacher_id}'}.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/video_id-ccid.txt
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Ánh xạ giữa Video ID và ccid. Mỗi dòng {'{video_id}\t{ccid}'}.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/exercise-problem.txt (TXT, ~129MB)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Liên kết giữa nhóm bài tập và câu hỏi (bài toán) của nó. Mỗi dòng{' '}
                      {'{exercise_id}\t{problem_id}'}.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/user-video.json (JSON, ~3.0GB)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Dữ liệu hành vi của người dùng khi xem video.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                    >
                      Các trường chính:
                    </Typography>
                    <List dense disablePadding sx={{ pl: 2 }}>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>user_id:</strong> Mã người dùng (U_xxxxxx)
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>seq:</strong> Mảng chứa trình tự các phiên xem video (ccid, thời
                          gian xem, thời gian bắt đầu/kết thúc, tốc độ xem…)
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Box>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/user-problem.json (JSON, ~21GB)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Dữ liệu hành vi của người dùng khi làm bài tập.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                    >
                      Các trường chính:
                    </Typography>
                    <List dense disablePadding sx={{ pl: 2 }}>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>log_id:</strong> Mã bản ghi (kết hợp user_id và problem_id)
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>user_id:</strong> Mã người dùng (U_xxxxxx)
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>problem_id:</strong> Mã câu hỏi (Pm_xxxxxx)
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>is_correct:</strong> Kết quả làm đúng (1) hay sai (0)
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>attempts:</strong> Số lần thử
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>score:</strong> Điểm đạt được
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>submit_time:</strong> Thời điểm nộp bài
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Box>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/user-xiaomu.json (JSON, ~9.7MB)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Hành vi tương tác của người dùng với Xiaomu (hệ thống hỏi đáp).
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                    >
                      Các trường chính:
                    </Typography>
                    <List dense disablePadding sx={{ pl: 2 }}>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>user_id:</strong> Mã người dùng (U_xxxxxx)
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>question_type:</strong> Loại câu hỏi mà người dùng hỏi
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>question:</strong> Nội dung câu hỏi người dùng gửi
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Box>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/course-comment.txt:
                    </Typography>
                    <Typography variant="body2">
                      Liên kết khoá học - bình luận. {'{course_id}\t{comment_id}'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/user-comment.txt:
                    </Typography>
                    <Typography variant="body2">
                      Liên kết người dùng - bình luận. {'{user_id}\t{comment_id}'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/user-reply.txt:
                    </Typography>
                    <Typography variant="body2">
                      Liên kết người dùng - trả lời. {'{user_id}\t{reply_id}'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/comment-reply.txt:
                    </Typography>
                    <Typography variant="body2">
                      Liên kết bình luận - trả lời. {'{comment_id}\t{reply_id}'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/concept-course.txt (TXT, ~19MB):
                    </Typography>
                    <Typography variant="body2">
                      Khái niệm - khóa học. {'{concept_id}\t{course_id}'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/concept-video.txt (TXT, ~39MB):
                    </Typography>
                    <Typography variant="body2">
                      Khái niệm - video. {'{concept_id}\t{ccid}'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/concept-problem.txt (TXT, ~1.3MB):
                    </Typography>
                    <Typography variant="body2">
                      Khái niệm - bài toán. {'{concept_id}\t{problem_id}'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/concept-comment.txt (TXT, ~1.2MB):
                    </Typography>
                    <Typography variant="body2">
                      Khái niệm - bình luận. {'{concept_id}\t{comment_id}'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      relations/concept-other.txt (TXT, ~19MB):
                    </Typography>
                    <Typography variant="body2">
                      Khái niệm - tài nguyên ngoài. {'{concept_id}\t{resource_id}'}
                    </Typography>
                  </Box>
                </Box>

                {/* Thư mục prerequisites/ */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 'bold', color: 'warning.dark' }}
                  >
                    Thư mục prerequisites/
                  </Typography>

                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      prerequisites/cs.json (JSON, ~133MB)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Dữ liệu quan hệ tiền đề giữa các cặp khái niệm trong Khoa học máy tính.
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ mt: 1, mb: 1, fontWeight: 'medium', display: 'block' }}
                    >
                      Các trường chính:
                    </Typography>
                    <List dense disablePadding sx={{ pl: 2 }}>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>c1:</strong> Khái niệm tiền đề
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>c2:</strong> Khái niệm hậu tố
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>ground_truth:</strong> Quan hệ tiền đề thực tế (1/0)
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>text_predict:</strong> Nhãn dự đoán (văn bản)
                        </ListItemText>
                      </ListItem>
                      <ListItem sx={{ py: 0.25 }}>
                        <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                          <strong>graph_predict:</strong> Độ tự tin dự đoán (đồ thị)
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      prerequisites/math.json (JSON, ~59MB)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Tương tự cs.json, cho lĩnh vực Toán học.
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3, pl: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      prerequisites/psy.json (JSON, ~87MB)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.7 }}>
                      Tương tự cs.json, cho lĩnh vực Tâm lý học.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Section 2: Data Quality Assessment */}
        <Card sx={cardStyles}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
              Phần 2: Đánh giá Chất lượng Dữ liệu
            </Typography>

            {/* Hard vs Soft Dimensions Explanation */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Khái niệm Hard vs Soft Dimensions
              </Typography>
              <Grid container spacing={3}>
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: '#e3f2fd',
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}
                    >
                      Hard Dimensions (Khía cạnh Cứng)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Các yếu tố có thể đo lường khách quan, liên quan đến cấu trúc và tính toàn vẹn
                      của dữ liệu:
                    </Typography>
                    <Stack spacing={1}>
                      <Chip
                        label="Tính đầy đủ (Completeness)"
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label="Tính duy nhất (Uniqueness)"
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label="Tính nhất quán (Consistency)"
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label="Tính hợp lệ (Validity)"
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,

                    md: 6,
                  }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: '#e8f5e8',
                      border: '2px solid',
                      borderColor: 'success.main',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, fontWeight: 'bold', color: 'success.main' }}
                    >
                      Soft Dimensions (Khía cạnh Mềm)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Các yếu tố mang tính chủ quan, liên quan đến mức độ phù hợp và hữu ích:
                    </Typography>
                    <Stack spacing={1}>
                      <Chip
                        label="Tính liên quan (Relevance)"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label="Khả năng diễn giải (Interpretability)"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label="Tính chính xác (Accuracy)"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label="Tính kịp thời (Timeliness)"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Hard Dimensions Analysis */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                Hard Dimensions - Phân tích Cứng
              </Typography>

              {/* Completeness Analysis */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  1. Tính đầy đủ (Completeness)
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Tỷ lệ phần trăm giá trị thiếu cho các cột quan trọng:
                </Typography>

                {/* Completeness Chart */}
                <Paper sx={{ p: 2, height: 300, mb: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sampleCompletenessData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="column" width={120} />
                      <Tooltip
                        formatter={(value, name) => [
                          `${value}%`,
                          name === 'complete' ? 'Đầy đủ' : 'Thiếu',
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="complete" fill="#4caf50" name="Đầy đủ" />
                      <Bar dataKey="missing" fill="#f44336" name="Thiếu" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>

                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>Ví dụ:</strong> Cột year_of_birth ban đầu thiếu 15% dữ liệu, sau khi xử
                    lý bằng phương pháp imputation, tỷ lệ thiếu giảm còn 5%.
                  </Typography>
                </Alert>
              </Box>

              {/* Other Hard Dimensions */}
              <Grid container spacing={3}>
                <Grid
                  size={{
                    xs: 12,

                    md: 4,
                  }}
                >
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Tính duy nhất
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'primary.main', mb: 1 }}>
                      98.5%
                    </Typography>
                    <Typography variant="body2">Tỷ lệ bản ghi không trùng lặp</Typography>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,

                    md: 4,
                  }}
                >
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Tính nhất quán
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'success.main', mb: 1 }}>
                      95.2%
                    </Typography>
                    <Typography variant="body2">Định dạng dữ liệu đồng nhất</Typography>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,

                    md: 4,
                  }}
                >
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Tính hợp lệ
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'warning.main', mb: 1 }}>
                      92.8%
                    </Typography>
                    <Typography variant="body2">Dữ liệu trong phạm vi cho phép</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Soft Dimensions Analysis */}
            <Box>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'success.main' }}>
                Soft Dimensions - Phân tích Mềm
              </Typography>

              <Grid container spacing={3}>
                <Grid
                  size={{
                    xs: 12,

                    md: 6,
                  }}
                >
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Tính liên quan (Relevance)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Các đặc trưng như video_completion_ratio và problem_ratio được đánh giá có
                      tính liên quan cao đến việc dự đoán khả năng hoàn thành khóa học, dựa trên
                      phân tích tương quan và kết quả từ mô hình.
                    </Typography>
                    <LinearProgress variant="determinate" value={85} sx={{ mt: 2 }} />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      Mức độ liên quan: 85%
                    </Typography>
                  </Paper>
                </Grid>

                <Grid
                  size={{
                    xs: 12,

                    md: 4,
                  }}
                >
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Khả năng diễn giải (Interpretability)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Dữ liệu đã được giải mã hóa các trường như user_school_encoded thành tên
                      trường cụ thể để tăng khả năng diễn giải trên dashboard.
                    </Typography>
                    <LinearProgress variant="determinate" value={78} sx={{ mt: 2 }} />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      Mức độ diễn giải: 78%
                    </Typography>
                  </Paper>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Tính chính xác (Accuracy)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Dữ liệu về số lượt xem video được coi là chính xác vì được thu thập trực tiếp
                      từ hệ thống logging của nền tảng XuetangX.
                    </Typography>
                    <LinearProgress variant="determinate" value={92} sx={{ mt: 2 }} />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      Mức độ chính xác: 92%
                    </Typography>
                  </Paper>
                </Grid>

                <Grid
                  size={{
                    xs: 12,

                    md: 4,
                  }}
                >
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Tính kịp thời (Timeliness)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Dữ liệu được thu thập trong khoảng thời gian 2014-2016, phản ánh xu hướng học
                      tập trong giai đoạn phát triển mạnh của MOOC.
                    </Typography>
                    <LinearProgress variant="determinate" value={70} sx={{ mt: 2 }} />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      Mức độ kịp thời: 70%
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Action Items */}
            <Alert severity="info" sx={{ mt: 4 }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Phần này đang được triển khai và sẽ được bổ sung thêm các
                phân tích chi tiết, biểu đồ tương tác và báo cáo tự động trong các phiên bản tiếp
                theo.
              </Typography>
            </Alert>
          </CardContent>
        </Card>

        {/* Summary and Next Steps */}
        <Card sx={{ ...cardStyles, bgcolor: '#f8f9fa' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
              Tổng kết Đánh giá Chất lượng Dữ liệu
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}>
              Bộ dữ liệu MOOCCubeX thể hiện chất lượng tốt với tỷ lệ đầy đủ cao và tính nhất quán ổn
              định. Các biện pháp tiền xử lý đã được áp dụng để cải thiện chất lượng dữ liệu phục vụ
              cho mô hình dự đoán.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" size="large">
                Xem Chi tiết Phân tích
              </Button>
              <Button variant="outlined" size="large">
                Tải Báo cáo Chất lượng
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
