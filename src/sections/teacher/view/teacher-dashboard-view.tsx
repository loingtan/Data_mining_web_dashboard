import { useMemo, useState } from 'react';
import {
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  PieChart,
  CartesianGrid,
  ResponsiveContainer,
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

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
  console.log(courses);
  // Prepare chart data for completion distribution
  const completionDistribution = useMemo(() => {
    const ranges = [
      { name: '0-25%', min: 0, max: 0.25, count: 0 },
      { name: '26-50%', min: 0.25, max: 0.5, count: 0 },
      { name: '51-75%', min: 0.5, max: 0.75, count: 0 },
      { name: '76-100%', min: 0.75, max: 1, count: 0 },
    ];

    courseData.forEach((item) => {
      const completion = parseFloat(item.video_completion);
      const range = ranges.find((r) => completion >= r.min && completion <= r.max);
      if (range) range.count++;
    });

    return ranges;
  }, [courseData]);

  return (
    <DashboardContent>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            label="Select Course"
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
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4">{stats.totalStudents}</Typography>
            </CardContent>
          </Card>
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={3} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Video Completion
              </Typography>
              <Typography variant="h4">{stats.avgVideoCompletion}%</Typography>
            </CardContent>
          </Card>
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={3} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Problem Completion
              </Typography>
              <Typography variant="h4">{stats.avgProblemCompletion}%</Typography>
            </CardContent>
          </Card>
        </Grid>{' '}
        <Grid item xs={12} sm={6} md={3} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Video Time (hours)
              </Typography>
              <Typography variant="h4">{Math.round(stats.totalVideoTime / 3600)}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>{' '}
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Video Completion Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, count }) => `${name}: ${count}`}
                >
                  {completionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>{' '}
        </Grid>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Student Performance Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseData.slice(0, 10)}>
                {' '}
                {/* Show top 10 students */}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="student_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="video_completion" fill="#8884d8" name="Video Completion" />
                <Bar dataKey="problem_completion" fill="#82ca9d" name="Problem Completion" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      {/* Student Details Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Student Details
        </Typography>
        <TableContainer>
          <Table>
            {' '}
            <TableHead>
              <TableRow>
                <TableCell>Student Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>School</TableCell>
                <TableCell>Year of Birth</TableCell>
                <TableCell align="right">Video Completion</TableCell>
                <TableCell align="right">Problem Completion</TableCell>
                <TableCell align="right">Video Views</TableCell>
                <TableCell align="right">Watch Time (min)</TableCell>
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
