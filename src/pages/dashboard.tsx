import { useState } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Card,
  Paper,
  Table,
  TableRow,
  Container,
  TextField,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CardContent,
  InputAdornment,
  TableContainer,
} from '@mui/material';

import { useUserCompletion } from 'src/utils/api';

// Mock data for demonstration - replace with actual data
const weeklyCompletionData = [
  { week: 'Tuần 1', completion: 65 },
  { week: 'Tuần 2', completion: 75 },
  { week: 'Tuần 3', completion: 82 },
  { week: 'Tuần 4', completion: 88 },
];

const courses = [
  { id: 1, name: 'Toán học', students: 120, completion: 85 },
  { id: 2, name: 'Vật lý', students: 95, completion: 78 },
  { id: 3, name: 'Hóa học', students: 110, completion: 82 },
];

export default function DashboardPage() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: userData, isLoading } = useUserCompletion();

  if (isLoading) {
    return <Box sx={{ p: 3 }}>Đang tải dữ liệu...</Box>;
  }

  return (
    <Container maxWidth="lg">
      {/* Project Introduction Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" gutterBottom>
          Hệ thống Dự đoán Kết quả Học tập
        </Typography>
        <Typography variant="body1" paragraph>
          Hệ thống này phân tích mẫu học tập của học sinh và dự đoán tỷ lệ hoàn thành khóa học của
          họ bằng cách sử dụng các thuật toán máy học tiên tiến.
        </Typography>
      </Box>

      {/* Data Visualization Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dự đoán Hoàn thành Theo Tuần
        </Typography>
        <Paper sx={{ p: 2, height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completion" stroke={theme.palette.primary.main} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Course Search Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tìm kiếm Khóa học
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm khóa học..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên Khóa học</TableCell>
                <TableCell align="right">Số Học viên</TableCell>
                <TableCell align="right">Tỷ lệ Hoàn thành</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell align="right">{course.students}</TableCell>
                  <TableCell align="right">{course.completion}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Input/Output Explanation Section */}
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tổng quan Hệ thống
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Dữ liệu Đầu vào (Input JSON)</Typography>
                <Box
                  component="pre"
                  sx={{
                    background: '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                    fontSize: 14,
                    overflow: 'auto',
                  }}
                >
                  {`{
  "user_id": "string",
  "course_id": "string",
  "video_completion": number,
  "problem_completion": number,
  "alpha": number,
  "completion": number,
  "num_videos": number,
  "num_problems": number,
  "num_teacher": number,
  "num_school": number,
  "field_encoded": number,
  "prerequisites_encoded": number,
  "num_exercises": number,
  "num_students": number,
  "total_default_video_time": number,
  "total_comments": number,
  "total_replies": number,
  "avg_comments_per_student": number,
  "avg_replies_per_student": number,
  "total_problem_attempts": number,
  "avg_problem_attempts_per_student": number,
  "course_total_completion_rate": number,
  "course_avg_completion_rate": number,
  "total_video_watch_time": number,
  "avg_video_watch_time_per_student": number,
  "problem_iscorrect_ratio": number,
  "problem_attempts_ratio": number,
  "problem_score_ratio": number,
  "problem_lang_ratio": number,
  "problem_option_ratio": number,
  "problem_type_ratio": number,
  "user_total_video_watch_time": number,
  "user_avg_video_watch_time": number,
  "video_watched": number
}`}
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Card>
              <CardContent>
z                <Typography variant="h6">Dự đoán Đầu ra (Output JSON)</Typography>
                <Box
                  component="pre"
                  sx={{
                    background: '#f5f5f5',
                    p: 2,
                    borderRadius: 2,
                    fontSize: 14,
                    overflow: 'auto',
                  }}
                >
                  {`{
  "composite_completion": number // Tỷ lệ hoàn thành tổng hợp dự đoán cho người dùng
}`}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
