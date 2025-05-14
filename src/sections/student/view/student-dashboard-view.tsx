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
