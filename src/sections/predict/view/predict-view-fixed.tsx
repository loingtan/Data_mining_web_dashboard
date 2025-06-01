import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';

interface UserActivity {
  student_id: string;
  student_name: string;
  course_code: string;
  course_name: string;
  completion: number;
  // Add other properties that are used in the component
  video_completion_rate: number;
  problem_completion_rate: number;
  total_time_spent: number;
  avg_session_duration: number;
  course_num_students: number;
  course_avg_completion: number;
  week_1_video_time?: number;
  week_1_problem_score?: number;
  week_2_video_time?: number;
  week_2_problem_score?: number;
  week_3_video_time?: number;
  week_3_problem_score?: number;
  week_4_video_time?: number;
  week_4_problem_score?: number;
  // Add more week properties as needed
}

type Props = {
  data: UserActivity[];
};

export function PredictView({ data }: Props) {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedData, setSelectedData] = useState<UserActivity | null>(null);

  useEffect(() => {
    if (selectedStudent && data.length > 0) {
      const studentData = data.find((item) => item.student_id === selectedStudent);
      setSelectedData(studentData || null);
    }
  }, [selectedStudent, data]);

  // Calculate weekly data for the selected student
  const getWeeklyData = () => {
    if (!selectedData) return [];

    const weeks = [];
    for (let i = 1; i <= 12; i++) {
      const videoTime = (selectedData as any)[`week_${i}_video_time`] || 0;
      const problemScore = (selectedData as any)[`week_${i}_problem_score`] || 0;
      weeks.push({
        week: i,
        videoTime: Number(videoTime) || 0,
        problemScore: Number(problemScore) || 0,
      });
    }
    return weeks;
  };

  const weeklyData = getWeeklyData();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dự đoán Kết quả Học tập
      </Typography>

      {/* Student Selection */}
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Chọn Học viên</InputLabel>
          <Select
            value={selectedStudent}
            label="Chọn Học viên"
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            {data.map((student) => (
              <MenuItem key={student.student_id} value={student.student_id}>
                {student.student_name} ({student.course_name})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedData && (
        <Grid container spacing={3}>
          {/* Completion Prediction Card */}
          <Grid item xs={12} md={6} {...({} as any)}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dự đoán Hoàn thành Khóa học
                </Typography>
                <Typography variant="h3" color="primary">
                  {(selectedData.completion * 100).toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khả năng hoàn thành khóa học thành công
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Performance Metrics Card */}
          <Grid item xs={12} md={6} {...({} as any)}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông số Hiệu suất
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    Video hoàn thành: {(selectedData.video_completion_rate * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">
                    Bài tập hoàn thành: {(selectedData.problem_completion_rate * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">
                    Tổng thời gian học: {Math.round(selectedData.total_time_spent / 3600)} giờ
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Course Statistics Card */}
          <Grid item xs={12} md={6} {...({} as any)}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thống kê Khóa học
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2">
                    Số học viên: {selectedData.course_num_students}
                  </Typography>
                  <Typography variant="body2">
                    Tỷ lệ hoàn thành trung bình:{' '}
                    {(selectedData.course_avg_completion * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">Khóa học: {selectedData.course_name}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recommendation Card */}
          <Grid item xs={12} md={6} {...({} as any)}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Khuyến nghị
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {selectedData.completion > 0.8 ? (
                    <Typography variant="body2" color="success.main">
                      ✓ Học viên có khả năng hoàn thành cao
                    </Typography>
                  ) : selectedData.completion > 0.6 ? (
                    <Typography variant="body2" color="warning.main">
                      ⚠ Cần theo dõi và hỗ trợ thêm
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="error.main">
                      ⚠ Nguy cơ không hoàn thành khóa học
                    </Typography>
                  )}

                  {selectedData.video_completion_rate < 0.5 && (
                    <Typography variant="body2" color="info.main">
                      💡 Khuyến khích xem video bài giảng
                    </Typography>
                  )}

                  {selectedData.problem_completion_rate < 0.5 && (
                    <Typography variant="body2" color="info.main">
                      💡 Cần tăng cường làm bài tập
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Weekly Progress Table */}
          <Grid item xs={12} {...({} as any)}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tiến độ theo Tuần
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tuần</TableCell>
                        <TableCell align="right">Thời gian Video (phút)</TableCell>
                        <TableCell align="right">Điểm Bài tập</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {weeklyData.map((week) => (
                        <TableRow key={week.week}>
                          <TableCell component="th" scope="row">
                            Tuần {week.week}
                          </TableCell>
                          <TableCell align="right">{Math.round(week.videoTime / 60)}</TableCell>
                          <TableCell align="right">{week.problemScore.toFixed(1)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
