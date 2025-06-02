import type { UserActivity } from 'src/utils/api';

import { useMemo, useState } from 'react';
import {
  Bar,
  Pie,
  Cell,
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  PieChart,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';

import { useTestPredictions, usePredictionModels } from 'src/utils/api';

import { DashboardContent } from 'src/layouts/dashboard';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Props {
  data: UserActivity[];
  studentId: string;
}

export function StudentDashboardView({ data, studentId }: Props) {
  const studentData = useMemo(() => data.filter((d) => d.user_id === studentId), [data, studentId]);

  const courses = useMemo(
    () => Array.from(new Set(studentData.map((d) => d.course_id))),
    [studentData]
  );
  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0] || '');
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);

  // Fetch prediction models and test predictions
  const { data: predictionModels, isLoading: modelsLoading } = usePredictionModels();
  const { data: testPredictions, isLoading: predictionsLoading } =
    useTestPredictions(selectedModelId);

  const courseDetail = useMemo(
    () => studentData.find((d) => d.course_id === selectedCourse),
    [studentData, selectedCourse]
  );

  // Calculate completion percentage
  const completionPercentage = (courseDetail?.completion || 0) * 100;

  // Find prediction for current user and course
  const currentPrediction = useMemo(() => {
    if (!testPredictions || !selectedCourse) return null;
    return testPredictions.find(
      (pred) => pred.user_id === studentId && pred.course_id === selectedCourse
    );
  }, [testPredictions, studentId, selectedCourse]);

  // Calculate prediction metrics
  const predictionMetrics = useMemo(() => {
    if (!currentPrediction) return null;

    const predicted = currentPrediction.predicted_completion * 100;
    const actual = completionPercentage;
    const error = Math.abs(predicted - actual);
    const accuracy = Math.max(0, 100 - error);

    return {
      predicted,
      actual,
      error,
      accuracy,
      isGoodPrediction: error <= 10, // Within 10% is considered good
    };
  }, [currentPrediction, completionPercentage]);

  // Prepare completion pie chart data
  const completionPie = [
    { name: 'Hoàn thành', value: completionPercentage },
    { name: 'Chưa hoàn thành', value: 100 - completionPercentage },
  ];

  // Prepare weekly progress data
  const weeklyProgress = [
    {
      week: 'Tuần 1',
      exercises: courseDetail?.ex_do_week1 || 0,
      problems: courseDetail?.problem_done_week1 || 0,
      score: courseDetail?.total_score_week1 || 0,
      videoTime: courseDetail?.total_video_watching_week1 || 0,
    },
    {
      week: 'Tuần 2',
      exercises: courseDetail?.ex_do_week2 || 0,
      problems: courseDetail?.problem_done_week2 || 0,
      score: courseDetail?.total_score_week2 || 0,
      videoTime: courseDetail?.total_video_watching_week2 || 0,
    },
    {
      week: 'Tuần 3',
      exercises: courseDetail?.ex_do_week3 || 0,
      problems: courseDetail?.problem_done_week3 || 0,
      score: courseDetail?.total_score_week3 || 0,
      videoTime: courseDetail?.total_video_watching_week3 || 0,
    },
    {
      week: 'Tuần 4',
      exercises: courseDetail?.ex_do_week4 || 0,
      problems: courseDetail?.problem_done_week4 || 0,
      score: courseDetail?.total_score_week4 || 0,
      videoTime: courseDetail?.total_video_watching_week4 || 0,
    },
  ];

  // Course comparison data
  const courseComparison = studentData.map((activity) => ({
    course: activity.course_id,
    completion: (activity.completion || 0) * 100,
    videoTime: parseFloat(activity.course_total_video_watch_time) || 0,
  }));

  // Video views bar chart data
  const videoViewsBar = useMemo(
    () =>
      courseComparison.map((course) => ({
        name: course.course,
        watchTime: course.videoTime,
      })),
    [courseComparison]
  );

  return (
    <DashboardContent>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Cho Học viên</Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Xem thông tin cá nhân, tiến độ học tập và số liệu liên quan đến khóa học đã đăng ký.
        </Typography>
      </Box>

      {/* Thông tin cá nhân */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Thông tin học viên
          </Typography>
          <Typography>Họ tên: {courseDetail?.user_id || studentId || '-'}</Typography>
          <Typography>Mã học viên: {courseDetail?.user_id || studentId || '-'}</Typography>
        </CardContent>
      </Card>

      {/* Chọn khóa học */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Chọn khóa học</Typography>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          fullWidth
          displayEmpty
        >
          {courses.map((courseId) => (
            <MenuItem key={courseId} value={courseId}>
              {courseId}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Chọn mô hình dự đoán */}
      {/* <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">Chọn mô hình dự đoán</Typography>
        <Select
          value={selectedModelId || ''}
          onChange={(e) => setSelectedModelId(e.target.value ? Number(e.target.value) : null)}
          fullWidth
          displayEmpty
          disabled={modelsLoading}
        >
          <MenuItem value="">
            <em>{modelsLoading ? 'Đang tải...' : 'Chọn mô hình'}</em>
          </MenuItem>
          {predictionModels?.map((model) => (
            <MenuItem key={model.model_id} value={model.model_id}>
              {model.model_name} (Algorithm: {model.algorithm_used})
            </MenuItem>
          ))}
        </Select>
      </Box> */}

      {/* Hiển thị dự đoán */}
      {/* {selectedModelId && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dự đoán hoàn thành khóa học
            </Typography>
            {predictionsLoading ? (
              <Typography>Đang tải dự đoán...</Typography>
            ) : currentPrediction && predictionMetrics ? (
              <Grid container spacing={2}>
                <Grid {...({} as any)} item xs={12} md={3}>
                  <Box
                    sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.light', borderRadius: 1 }}
                  >
                    <Typography variant="h4" color="primary.contrastText">
                      {predictionMetrics.predicted.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                      Dự đoán hoàn thành
                    </Typography>
                  </Box>
                </Grid>
                <Grid {...({} as any)} item xs={12} md={3}>
                  <Box
                    sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}
                  >
                    <Typography variant="h4" color="secondary.contrastText">
                      {predictionMetrics.actual.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="secondary.contrastText">
                      Thực tế hoàn thành
                    </Typography>
                  </Box>
                </Grid>
                <Grid {...({} as any)} item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                    <Typography variant="h4" color="error.contrastText">
                      {predictionMetrics.error.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" color="error.contrastText">
                      Sai số dự đoán
                    </Typography>
                  </Box>
                </Grid>
                <Grid {...({} as any)} item xs={12} md={3}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      bgcolor: predictionMetrics.isGoodPrediction
                        ? 'success.light'
                        : 'warning.light',
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      color={
                        predictionMetrics.isGoodPrediction
                          ? 'success.contrastText'
                          : 'warning.contrastText'
                      }
                    >
                      {predictionMetrics.accuracy.toFixed(1)}%
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        predictionMetrics.isGoodPrediction
                          ? 'success.contrastText'
                          : 'warning.contrastText'
                      }
                    >
                      Độ chính xác
                    </Typography>
                  </Box>
                </Grid>
                <Grid {...({} as any)} item xs={12}>
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Chi tiết dự đoán:</strong> ID: {currentPrediction.prediction_id} | Mô
                      hình: {currentPrediction.model_id} | Loại dữ liệu:{' '}
                      {currentPrediction.set_type} | Đánh giá:{' '}
                      {predictionMetrics.isGoodPrediction ? 'Dự đoán tốt' : 'Dự đoán cần cải thiện'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary">
                Không tìm thấy dự đoán cho học viên và khóa học này với mô hình đã chọn.
              </Typography>
            )}
          </CardContent>
        </Card>
      )} */}

      {/* Thông tin khóa học */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tỉ lệ hoàn thành khóa học</Typography>
              <Typography variant="h4">
                {((courseDetail?.completion || 0) * 100).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6">Số bài tập tuần 1</Typography>
              <Typography variant="h4">{courseDetail?.problem_done_week1 || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6">Thời lượng xem video tuần 1</Typography>
              <Typography variant="h4">{courseDetail?.total_video_watching_week1 || 0}s</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6">Số video tuần 1</Typography>
              <Typography variant="h4">{courseDetail?.course_num_videos || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ Pie */}
        <Grid item xs={12} md={6} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Biểu đồ hoàn thành
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={completionPie}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {completionPie.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ Bar */}
        <Grid item xs={12} md={6} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thời lượng xem video theo khóa học
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={videoViewsBar}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="watchTime" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ tiến độ 4 tuần */}
        <Grid item xs={12} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tiến độ học tập 4 tuần
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="exercises" stroke="#8884d8" name="Bài tập" />
                  <Line type="monotone" dataKey="problems" stroke="#82ca9d" name="Bài toán" />
                  <Line type="monotone" dataKey="score" stroke="#ffc658" name="Điểm số" />
                  <Line
                    type="monotone"
                    dataKey="videoTime"
                    stroke="#ff7300"
                    name="Thời gian video"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Chi tiết hoạt động 4 tuần */}
        <Grid item xs={12} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chi tiết hoạt động 4 tuần
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tuần</TableCell>
                      <TableCell align="right">Bài tập hoàn thành</TableCell>
                      <TableCell align="right">Bài toán hoàn thành</TableCell>
                      <TableCell align="right">Tổng điểm</TableCell>
                      <TableCell align="right">Thời gian xem video</TableCell>
                      <TableCell align="right">Câu trả lời đúng</TableCell>
                      <TableCell align="right">Tổng số lần thử</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {weeklyProgress.map((week, index) => (
                      <TableRow key={week.week}>
                        <TableCell component="th" scope="row">
                          {week.week}
                        </TableCell>
                        <TableCell align="right">{week.exercises}</TableCell>
                        <TableCell align="right">{week.problems}</TableCell>
                        <TableCell align="right">{week.score}</TableCell>
                        <TableCell align="right">{week.videoTime}s</TableCell>
                        <TableCell align="right">
                          {(index === 0 && courseDetail?.total_correct_answer_week1) ||
                            (index === 1 && courseDetail?.total_correct_answer_week2) ||
                            (index === 2 && courseDetail?.total_correct_answer_week3) ||
                            (index === 3 && courseDetail?.total_correct_answer_week4) ||
                            0}
                        </TableCell>
                        <TableCell align="right">
                          {(index === 0 && courseDetail?.total_attempt_week1) ||
                            (index === 1 && courseDetail?.total_attempt_week2) ||
                            (index === 2 && courseDetail?.total_attempt_week3) ||
                            (index === 3 && courseDetail?.total_attempt_week4) ||
                            0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bảng chi tiết */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Chi tiết các khóa học đã đăng ký
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Khóa học</TableCell>
                <TableCell>Hoàn thành video (%)</TableCell>
                <TableCell>Hoàn thành bài tập (%)</TableCell>
                <TableCell>Thời lượng xem (s)</TableCell>
                <TableCell>Số video đã xem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((courseId) => {
                const d = studentData.find((x) => x.course_id === courseId);
                return (
                  <TableRow key={courseId}>
                    <TableCell>{courseId}</TableCell>
                    <TableCell>{d ? ((d.completion || 0) * 100).toFixed(1) : 0}</TableCell>
                    <TableCell>
                      {d ? (d.course_total_completion_rate * 100).toFixed(1) : 0}
                    </TableCell>
                    <TableCell>{d ? parseFloat(d.course_total_video_watch_time) : 0}</TableCell>
                    <TableCell>{d ? d.course_num_videos : 0}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DashboardContent>
  );
}
