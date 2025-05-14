import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {
    Box, Grid, Typography, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Props {
    data: any[];  // mỗi phần tử là 1 dòng từ dataset
}

export function TeacherDashboardView({ data }: Props) {
    const [selectedCourse, setSelectedCourse] = useState<string>('');

    const courses = useMemo(() => Array.from(new Set(data.map((d) => d.course_id))), [data]);

    const filtered = useMemo(() =>
        selectedCourse ? data.filter((d) => d.course_id === selectedCourse) : [],
        [data, selectedCourse]
    );

    const courseStats = useMemo(() => {
        if (filtered.length === 0) return null;

        const totalStudents = filtered.length;
        const avgVideoCompletion = filtered.reduce((sum, d) => sum + parseFloat(d.video_completion), 0) / totalStudents;
        const avgProblemCompletion = filtered.reduce((sum, d) => sum + parseFloat(d.problem_completion), 0) / totalStudents;
        const avgWatchTime = filtered.reduce((sum, d) => sum + parseFloat(d.user_total_video_watch_time), 0) / totalStudents;
        const avgProblemAttempts = filtered.reduce((sum, d) => sum + parseFloat(d.avg_problem_attempts_per_student), 0) / totalStudents;

        return {
            totalStudents,
            avgVideoCompletion,
            avgProblemCompletion,
            avgWatchTime,
            avgProblemAttempts,
        };
    }, [filtered]);

    // Tổng lượt xem video (giả sử trường user_total_video_views)
    const totalVideoViews = useMemo(() =>
        filtered.reduce((sum, d) => sum + (parseInt(d.user_total_video_views) || 0), 0)
        , [filtered]);

    // Phân phối số học sinh theo mức độ hoàn thành video
    const completionDistribution = useMemo(() => {
        // Các mức: <50%, 50-80%, 80-100%, 100%
        const dist = [0, 0, 0, 0];
        filtered.forEach(d => {
            const percent = parseFloat(d.video_completion) * 100;
            if (percent < 50) dist[0]++;
            else if (percent < 80) dist[1]++;
            else if (percent < 100) dist[2]++;
            else dist[3]++;
        });
        return [
            { name: '<50%', value: dist[0] },
            { name: '50-80%', value: dist[1] },
            { name: '80-99%', value: dist[2] },
            { name: '100%', value: dist[3] },
        ];
    }, [filtered]);

    return (
        <DashboardContent>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4">Dashboard Giảng viên</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Thống kê hoạt động học tập của sinh viên theo từng khóa học.
                </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1">Chọn khóa học</Typography>
                <Select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    fullWidth
                    displayEmpty
                >
                    <MenuItem value="">-- Chọn khóa học --</MenuItem>
                    {courses.map((courseId) => (
                        <MenuItem key={courseId} value={courseId}>
                            {courseId}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            {courseStats && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} {...({} as any)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Tổng số sinh viên</Typography>
                                <Typography variant="h4">{courseStats.totalStudents}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} {...({} as any)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Tỉ lệ hoàn thành video TB</Typography>
                                <Typography variant="h4">{(courseStats.avgVideoCompletion * 100).toFixed(1)}%</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} {...({} as any)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Tỉ lệ hoàn thành bài tập TB</Typography>
                                <Typography variant="h4">{(courseStats.avgProblemCompletion * 100).toFixed(1)}%</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6} {...({} as any)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Thời lượng xem video TB</Typography>
                                <Typography variant="h4">{courseStats.avgWatchTime.toFixed(1)}s</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Tổng lượt xem video */}
                    <Grid item xs={12} md={6} {...({} as any)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Tổng lượt xem video</Typography>
                                <Typography variant="h4">{totalVideoViews}</Typography>
                                <ResponsiveContainer width="100%" height={180}>
                                    <BarChart data={filtered.map(d => ({
                                        name: d.student_name || d.student_id,
                                        views: parseInt(d.user_total_video_views) || 0
                                    }))}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="views" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Biểu đồ pie phân phối mức độ hoàn thành video */}
                    <Grid item xs={12} md={6} {...({} as any)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Phân phối học viên theo mức độ hoàn thành video</Typography>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={completionDistribution}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={70}
                                            label
                                        >
                                            {completionDistribution.map((entry, idx) => (
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

                    {/* Bảng danh sách học viên */}
                    <Grid item xs={12} {...({} as any)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Danh sách học viên</Typography>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>STT</TableCell>
                                                <TableCell>Họ tên</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Hoàn thành video (%)</TableCell>
                                                <TableCell>Hoàn thành bài tập (%)</TableCell>
                                                <TableCell>Lượt xem video</TableCell>
                                                <TableCell>Thời lượng xem (s)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filtered.map((row, idx) => (
                                                <TableRow key={row.student_id || row.user_id || idx}>
                                                    <TableCell>{idx + 1}</TableCell>
                                                    <TableCell>
                                                        {row.student_name || row.user_id || '-'}
                                                    </TableCell>
                                                    <TableCell>{row.student_email || '-'}</TableCell>
                                                    <TableCell>{((parseFloat(row.video_completion) || 0) * 100).toFixed(1)}</TableCell>
                                                    <TableCell>{((parseFloat(row.problem_completion) || 0) * 100).toFixed(1)}</TableCell>
                                                    <TableCell>{row.user_total_video_views || 0}</TableCell>
                                                    <TableCell>{row.user_total_video_watch_time || 0}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Biểu đồ so sánh hoàn thành */}
                    <Grid item xs={12} {...({} as any)}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Biểu đồ so sánh hoàn thành</Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={[
                                        { name: 'Video', value: courseStats.avgVideoCompletion * 100 },
                                        { name: 'Bài tập', value: courseStats.avgProblemCompletion * 100 }
                                    ]}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </DashboardContent>
    );
}
