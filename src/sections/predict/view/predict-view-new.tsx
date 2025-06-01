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
  user_id: string;
  course_id: string;
  completion: number;
  alpha: number;
  course_num_students: number;
  course_num_videos: number;
  course_num_exercises: number;
  course_num_problems: number;
  course_num_teacher: number;
  course_total_completion_rate: number;
  ex_do_week1: number;
  ex_do_week2: number;
  ex_do_week3: number;
  ex_do_week4: number;
  problem_done_week1: number;
  problem_done_week2: number;
  problem_done_week3: number;
  problem_done_week4: number;
  total_score_week1: number;
  total_score_week2: number;
  total_score_week3: number;
  total_score_week4: number;
  total_video_watching_week1: number;
  total_video_watching_week2: number;
  total_video_watching_week3: number;
  total_video_watching_week4: number;
  comment_count_week1: string;
  comment_count_week2: string;
  comment_count_week3: string;
  comment_count_week4: string;
}

type Props = {
  data: UserActivity[];
};

export function PredictView({ data }: Props) {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [courseList, setCourseList] = useState<string[]>([]);
  const [studentList, setStudentList] = useState<string[]>([]);
  const [selectedData, setSelectedData] = useState<UserActivity | null>(null);

  useEffect(() => {
    const uniqueCourses = Array.from(new Set(data.map((row) => row.course_id)));
    setCourseList(uniqueCourses);
  }, [data]);

  useEffect(() => {
    if (selectedCourse) {
      const filteredStudents = data
        .filter((row) => row.course_id === selectedCourse)
        .map((row) => row.user_id);
      const uniqueStudents = Array.from(new Set(filteredStudents));
      setStudentList(uniqueStudents);
      setSelectedStudent('');
      setSelectedData(null);
    }
  }, [selectedCourse, data]);

  useEffect(() => {
    if (selectedStudent && selectedCourse) {
      const studentData = data.find(
        (row) => row.course_id === selectedCourse && row.user_id === selectedStudent
      );
      setSelectedData(studentData || null);
    }
  }, [selectedStudent, selectedCourse, data]);

  const getWeeklyProgress = (userData: UserActivity) => {
    const weeks = [
      {
        week: 'Tuần 1',
        exercises: userData.ex_do_week1 || 0,
        problems: userData.problem_done_week1 || 0,
        score: userData.total_score_week1 || 0,
        videoTime: userData.total_video_watching_week1 || 0,
        comments: parseFloat(userData.comment_count_week1) || 0,
      },
      {
        week: 'Tuần 2',
        exercises: userData.ex_do_week2 || 0,
        problems: userData.problem_done_week2 || 0,
        score: userData.total_score_week2 || 0,
        videoTime: userData.total_video_watching_week2 || 0,
        comments: parseFloat(userData.comment_count_week2) || 0,
      },
      {
        week: 'Tuần 3',
        exercises: userData.ex_do_week3 || 0,
        problems: userData.problem_done_week3 || 0,
        score: userData.total_score_week3 || 0,
        videoTime: userData.total_video_watching_week3 || 0,
        comments: parseFloat(userData.comment_count_week3) || 0,
      },
      {
        week: 'Tuần 4',
        exercises: userData.ex_do_week4 || 0,
        problems: userData.problem_done_week4 || 0,
        score: userData.total_score_week4 || 0,
        videoTime: userData.total_video_watching_week4 || 0,
        comments: parseFloat(userData.comment_count_week4) || 0,
      },
    ];
    return weeks;
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Phân tích Hoạt động Học viên và Dự đoán
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khóa học</InputLabel>
          <Select
            value={selectedCourse}
            label="Khóa học"
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {courseList.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} disabled={!selectedCourse}>
          <InputLabel>Học sinh</InputLabel>
          <Select
            value={selectedStudent}
            label="Học sinh"
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            {studentList.map((student) => (
              <MenuItem key={student} value={student}>
                {student}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedData && (
        <Grid container spacing={3}>
          {/* Completion Prediction Card */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dự đoán Hoàn thành Khóa học
                </Typography>
                <Typography variant="h3" color="primary">
                  {(selectedData.completion * 100).toFixed(2)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Học viên: {selectedStudent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Khóa học: {selectedCourse}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Alpha: {selectedData.alpha}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Course Statistics Card */}
          <Grid size={{ xs: 12, md: 6 }}>
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
                    Số video: {selectedData.course_num_videos}
                  </Typography>
                  <Typography variant="body2">
                    Số bài tập: {selectedData.course_num_exercises}
                  </Typography>
                  <Typography variant="body2">
                    Số câu hỏi: {selectedData.course_num_problems}
                  </Typography>
                  <Typography variant="body2">
                    Số giáo viên: {selectedData.course_num_teacher}
                  </Typography>
                  <Typography variant="body2">
                    Tỷ lệ hoàn thành trung bình:{' '}
                    {selectedData.course_total_completion_rate.toFixed(2)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Weekly Progress Table */}
          <Grid size={{ xs: 12 }}>
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
                        <TableCell align="right">Bài tập</TableCell>
                        <TableCell align="right">Câu hỏi</TableCell>
                        <TableCell align="right">Điểm số</TableCell>
                        <TableCell align="right">Thời gian xem video (phút)</TableCell>
                        <TableCell align="right">Bình luận</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getWeeklyProgress(selectedData).map((week) => (
                        <TableRow key={week.week}>
                          <TableCell>{week.week}</TableCell>
                          <TableCell align="right">{week.exercises}</TableCell>
                          <TableCell align="right">{week.problems}</TableCell>
                          <TableCell align="right">{week.score}</TableCell>
                          <TableCell align="right">{week.videoTime}</TableCell>
                          <TableCell align="right">{week.comments}</TableCell>
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

      {!selectedData && selectedCourse && selectedStudent && (
        <Typography variant="body1" color="text.secondary">
          Không tìm thấy dữ liệu cho học viên và khóa học đã chọn.
        </Typography>
      )}
    </Box>
  );
}
