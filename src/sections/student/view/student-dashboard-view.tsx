import { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
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

<<<<<<< Updated upstream
=======
import { generateChineseName } from 'src/utils/generateChineseName';
import { useTestPredictions, usePredictionModels } from 'src/utils/api';

>>>>>>> Stashed changes
import { DashboardContent } from 'src/layouts/dashboard';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Props {
    data: any[];
    studentId: string;
}

export function StudentDashboardView({ data, studentId }: Props) {
    const studentData = useMemo(
        () => data.filter(d => d.user_id === studentId),
        [data, studentId]
    );

    const studentInfo = studentData[0] || {};
    const courses = useMemo(
        () => Array.from(new Set(studentData.map(d => d.course_id))),
        [studentData]
    );
    const [selectedCourse, setSelectedCourse] = useState<string>(courses[0] || '');

    const courseDetail = useMemo(
        () => studentData.find(d => d.course_id === selectedCourse) || {},
        [studentData, selectedCourse]
    );

    const completionPie = [
        { name: 'Video', value: (parseFloat(courseDetail.video_completion) || 0) * 100 },
        { name: 'Bài tập', value: (parseFloat(courseDetail.problem_completion) || 0) * 100 },
    ];

    const videoViewsBar = courses.map(courseId => {
        const d = studentData.find(x => x.course_id === courseId) || {};
        return {
            name: courseId,
            watchTime: parseFloat(d.user_total_video_watch_time) || 0,
        };
    });

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
                    <Typography variant="h6" gutterBottom>Thông tin học viên</Typography>
                    <Typography>Họ tên: {studentInfo.student_name || studentInfo.user_id || '-'}</Typography>
                    <Typography>Mã học viên: {studentInfo.user_id || '-'}</Typography>
                </CardContent>
            </Card>

<<<<<<< Updated upstream
            {/* Chọn khóa học */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1">Chọn khóa học</Typography>
                <Select
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    fullWidth
                    displayEmpty
                >
                    {courses.map(courseId => (
                        <MenuItem key={courseId} value={courseId}>
                            {courseId}
                        </MenuItem>
=======
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
                  <Typography>
                      Họ tên: {
                          (courseDetail?.user_id || studentId)
                              ? generateChineseName(courseDetail?.user_id || studentId)
                              : '-'
                      }
                  </Typography>
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
>>>>>>> Stashed changes
                    ))}
                </Select>
            </Box>

            {/* Thông tin khóa học */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tỉ lệ hoàn thành video</Typography>
                            <Typography variant="h4">
                                {((parseFloat(courseDetail.video_completion) || 0) * 100).toFixed(1)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tỉ lệ hoàn thành bài tập</Typography>
                            <Typography variant="h4">
                                {((parseFloat(courseDetail.problem_completion) || 0) * 100).toFixed(1)}%
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Thời lượng xem video</Typography>
                            <Typography variant="h4">
                                {courseDetail.user_total_video_watch_time || 0}s
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Số video đã xem</Typography>
                            <Typography variant="h4">
                                {courseDetail.video_watched || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Biểu đồ Pie */}
                <Grid item xs={12} md={6} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Biểu đồ hoàn thành</Typography>
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
                            <Typography variant="h6" gutterBottom>Thời lượng xem video theo khóa học</Typography>
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
            </Grid>

            {/* Bảng chi tiết */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Chi tiết các khóa học đã đăng ký</Typography>
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
                            {courses.map(courseId => {
                                const d = studentData.find(x => x.course_id === courseId) || {};
                                return (
                                    <TableRow key={courseId}>
                                        <TableCell>{courseId}</TableCell>
                                        <TableCell>{((parseFloat(d.video_completion) || 0) * 100).toFixed(1)}</TableCell>
                                        <TableCell>{((parseFloat(d.problem_completion) || 0) * 100).toFixed(1)}</TableCell>
                                        <TableCell>{d.user_total_video_watch_time || 0}</TableCell>
                                        <TableCell>{d.video_watched || 0}</TableCell>
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
