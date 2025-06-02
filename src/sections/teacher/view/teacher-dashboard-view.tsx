import { useMemo, useState } from 'react';
import {
  Bar,
  Cell,
  BarChart,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';

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

import { DashboardContent } from 'src/layouts/dashboard';

interface TeacherData {
  course_id: string;
  course_name: string;
  user_id: string;
  student_name: string;
  student_email: string;
  gender: string;
  school: string;
  year_of_birth: number | null;
  video_completion: string;
  problem_completion: string;
  user_total_video_views: number;
  user_total_video_watch_time: number;
}

interface Props {
  data: TeacherData[];
}

export function TeacherDashboardView({ data }: Props) {
  console.log(data);
  const courses = useMemo(() => {
    const courseMap = new Map();
    data.forEach((item) => {
      if (!courseMap.has(item.course_id)) {
        courseMap.set(item.course_id, item.course_name);
      }
    });
    return Array.from(courseMap.entries()).map(([id, name]) => ({ id, name }));
  }, [data]);

  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.id || '');

  // Filter data by selected course
  const courseData = useMemo(
    () => data.filter((item) => item.course_id === selectedCourse),
    [data, selectedCourse]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    if (courseData.length === 0) {
      return {
        totalStudents: 0,
        avgVideoCompletion: 0,
        avgProblemCompletion: 0,
        totalVideoTime: 0,
      };
    }

    const totalStudents = courseData.length;
    const avgVideoCompletion =
      courseData.reduce((sum, item) => sum + parseFloat(item.video_completion), 0) / totalStudents;
    const avgProblemCompletion =
      courseData.reduce((sum, item) => sum + parseFloat(item.problem_completion), 0) /
      totalStudents;
    const totalVideoTime = courseData.reduce(
      (sum, item) => sum + item.user_total_video_watch_time,
      0
    );

    return {
      totalStudents,
      avgVideoCompletion: Math.round(avgVideoCompletion * 100),
      avgProblemCompletion: Math.round(avgProblemCompletion * 100),
      totalVideoTime,
    };
  }, [courseData]);
  console.log(courses); // Prepare chart data for completion distribution
  const completionDistribution = useMemo(() => {
    const ranges = [
      { name: '0-25%', min: 0, max: 0.25, count: 0, color: '#FF6B6B' },
      { name: '26-50%', min: 0.25, max: 0.5, count: 0, color: '#FFA726' },
      { name: '51-75%', min: 0.5, max: 0.75, count: 0, color: '#42A5F5' },
      { name: '76-100%', min: 0.75, max: 1, count: 0, color: '#66BB6A' },
    ];

    courseData.forEach((item) => {
      const completion = parseFloat(item.video_completion);
      const range = ranges.find((r) => completion >= r.min && completion <= r.max);
      if (range) range.count++;
    });

    return ranges;
  }, [courseData]);

  // Prepare scatter plot data for performance comparison
  const performanceScatterData = useMemo(
    () =>
      courseData.map((item) => ({
        x: parseFloat(item.video_completion) * 100,
        y: parseFloat(item.problem_completion) * 100,
        name: item.student_name,
        size: item.user_total_video_views / 10, // Scale down for visualization
      })),
    [courseData]
  );

  // Prepare detailed completion histogram (more granular than ranges)
  const detailedCompletionData = useMemo(() => {
    const buckets = Array.from({ length: 10 }, (_, i) => ({
      range: `${i * 10}-${(i + 1) * 10}%`,
      count: 0,
      videoCount: 0,
      problemCount: 0,
    }));

    courseData.forEach((item) => {
      const videoCompletion = Math.floor(parseFloat(item.video_completion) * 10);
      const problemCompletion = Math.floor(parseFloat(item.problem_completion) * 10);

      if (videoCompletion >= 0 && videoCompletion < 10) {
        buckets[videoCompletion].videoCount++;
      }
      if (problemCompletion >= 0 && problemCompletion < 10) {
        buckets[problemCompletion].problemCount++;
      }
    });

    return buckets;
  }, [courseData]);

  return (
    <DashboardContent>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>{' '}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Chọn Khóa Học</InputLabel>
          <Select
            value={selectedCourse}
            label="Chọn Khóa Học"
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {' '}
        <Grid item xs={12} sm={6} md={3} {...({} as any)}>
          {' '}
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng Số Học Viên
              </Typography>
              <Typography variant="h4">{stats.totalStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={3} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                TB Hoàn Thành Video
              </Typography>
              <Typography variant="h4">{stats.avgVideoCompletion}%</Typography>
            </CardContent>
          </Card>
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={3} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                TB Hoàn Thành Bài Tập
              </Typography>
              <Typography variant="h4">{stats.avgProblemCompletion}%</Typography>
            </CardContent>
          </Card>
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={3} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Tổng Thời Gian Video (giờ)
              </Typography>
              <Typography variant="h4">{Math.round(stats.totalVideoTime / 3600)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>{' '}
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Enhanced Video Completion Distribution - Bar Chart */}
        <Grid item xs={12} md={6} {...({} as any)}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Phân Bố Hoàn Thành Video
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [`${value} học viên`, 'Số lượng']}
                  labelFormatter={(label) => `Khoảng: ${label}`}
                />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {completionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Summary statistics below chart */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {completionDistribution.map((range, index) => (
                <Box
                  key={range.name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    bgcolor: 'grey.50',
                    p: 1,
                    borderRadius: 1,
                    minWidth: '100px',
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: range.color,
                      borderRadius: '50%',
                    }}
                  />
                  <Typography variant="caption">
                    {range.name}: {range.count}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Detailed Completion Comparison - Grouped Bar Chart */}
        <Grid item xs={12} md={6} {...({} as any)}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              So Sánh Chi Tiết Hoàn Thành (Video vs Bài Tập)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={detailedCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value} học viên`,
                    name === 'videoCount' ? 'Video' : 'Bài Tập',
                  ]}
                />
                <Legend />
                <Bar
                  dataKey="videoCount"
                  fill="#8884d8"
                  name="Hoàn thành Video"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="problemCount"
                  fill="#82ca9d"
                  name="Hoàn thành Bài Tập"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance Correlation Scatter Plot */}
        <Grid item xs={12} {...({} as any)}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mối Tương Quan Hiệu Suất: Video vs Bài Tập
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Mỗi điểm đại diện cho một học viên. Kích thước điểm tương ứng với số lượt xem video.
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={performanceScatterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Video Completion"
                  unit="%"
                  domain={[0, 100]}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Problem Completion"
                  unit="%"
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => {
                    if (name === 'x') return [`${value}%`, 'Hoàn thành Video'];
                    if (name === 'y') return [`${value}%`, 'Hoàn thành Bài Tập'];
                    return [value, name];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `Học viên: ${payload[0].payload.name}`;
                    }
                    return label;
                  }}
                />
                <Scatter dataKey="y" fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
            {/* Performance insights */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box
                sx={{
                  bgcolor: 'success.lighter',
                  p: 1.5,
                  borderRadius: 1,
                  flex: 1,
                  minWidth: '200px',
                }}
              >
                <Typography variant="subtitle2" color="success.dark">
                  Hiệu suất cao (≥75%)
                </Typography>
                <Typography variant="body2">
                  {performanceScatterData.filter((d) => d.x >= 75 && d.y >= 75).length} học viên
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: 'warning.lighter',
                  p: 1.5,
                  borderRadius: 1,
                  flex: 1,
                  minWidth: '200px',
                }}
              >
                <Typography variant="subtitle2" color="warning.dark">
                  Cần hỗ trợ (25-75%)
                </Typography>
                <Typography variant="body2">
                  {
                    performanceScatterData.filter(
                      (d) => (d.x >= 25 && d.x < 75) || (d.y >= 25 && d.y < 75)
                    ).length
                  }{' '}
                  học viên
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: 'error.lighter',
                  p: 1.5,
                  borderRadius: 1,
                  flex: 1,
                  minWidth: '200px',
                }}
              >
                <Typography variant="subtitle2" color="error.dark">
                  Nguy cơ cao (&lt;25%)
                </Typography>
                <Typography variant="body2">
                  {performanceScatterData.filter((d) => d.x < 25 && d.y < 25).length} học viên
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>{' '}
      {/* Student Details Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chi Tiết Học Viên
        </Typography>
        <TableContainer>
          <Table>
            {' '}
            <TableHead>
              <TableRow>
                <TableCell>Tên Học Viên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Giới Tính</TableCell>
                <TableCell>Trường</TableCell>
                <TableCell>Năm Sinh</TableCell>
                <TableCell align="right">Hoàn Thành Video</TableCell>
                <TableCell align="right">Hoàn Thành Bài Tập</TableCell>
                <TableCell align="right">Lượt Xem Video</TableCell>
                <TableCell align="right">Thời Gian Xem (phút)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courseData.map((student) => (
                <TableRow key={student.user_id}>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{student.student_email}</TableCell>
                  <TableCell>{student.gender}</TableCell>
                  <TableCell>{student.school || 'N/A'}</TableCell>
                  <TableCell>{student.year_of_birth || 'N/A'}</TableCell>
                  <TableCell align="right">
                    {(parseFloat(student.video_completion) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    {(parseFloat(student.problem_completion) * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">{student.user_total_video_views}</TableCell>
                  <TableCell align="right">
                    {Math.round(student.user_total_video_watch_time / 60)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </DashboardContent>
  );
}
