import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

// Định nghĩa kiểu dữ liệu (phù hợp với dataset_final.json)
type DataRow = {
    user_id: string;
    course_id: string;
    video_completion: number;
    problem_completion: number;
    alpha: number;
    completion: number;
    num_videos: number;
    num_problems: number;
    num_teacher: number;
    num_school: number;
    field_encoded: number | null;
    prerequisites_encoded: number | null;
    num_exercises: number;
    num_students: number;
    total_default_video_time: number;
    total_comments: number;
    total_replies: number;
    avg_comments_per_student: number;
    avg_replies_per_student: number;
    total_problem_attempts: number;
    avg_problem_attempts_per_student: number;
    course_total_completion_rate: number;
    course_avg_completion_rate: number;
    total_video_watch_time: number;
    avg_video_watch_time_per_student: number;
    problem_iscorrect_ratio: number;
    problem_attempts_ratio: number;
    problem_score_ratio: number;
    problem_lang_ratio: number;
    problem_option_ratio: number;
    problem_type_ratio: number;
    user_total_video_watch_time: number;
    user_avg_video_watch_time: number;
    video_watched: number;
};

type Props = {
    data: DataRow[];
};

// Dữ liệu mẫu cho biểu đồ
const sampleData = [
    { name: 'Hoàn thành', value: 75 },
    { name: 'Không hoàn thành', value: 25 },
];

export function HomeView({ data }: Props) {
    return (
        <DashboardContent>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
                    Dự đoán mức độ hoàn thành khóa học của học viên
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Nền tảng phân tích và dự đoán hành vi học tập của học viên nhằm hỗ trợ giảng viên và nhà quản lý giáo dục.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Tổng quan nhanh về dữ liệu */}
                <Grid item xs={12} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Tổng quan Dữ liệu
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Tổng số bản ghi: <strong>{data.length}</strong>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Giới thiệu bộ dữ liệu */}
                <Grid item xs={12} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Giới thiệu Bộ dữ liệu
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Bộ dữ liệu chứa thông tin chi tiết về hành vi học tập của học viên như thời gian xem video, số bài tập hoàn thành, mức độ tương tác và nhiều chỉ số đặc trưng khác giúp mô hình dự đoán chính xác hơn.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Mô tả mô hình và cách dự đoán */}
                <Grid item xs={12} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Phương pháp dự đoán và mô hình sử dụng
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                Hệ thống sử dụng các đặc trưng như thời gian xem video, số lần làm bài tập, tương tác xã hội... để huấn luyện mô hình học máy.
                                Các mô hình như Logistic Regression, Random Forest, và Neural Networks đã được thử nghiệm để tối ưu hóa độ chính xác.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Biểu đồ minh họa (ví dụ giả lập) */}
                <Grid item xs={12} {...({} as any)}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Biểu đồ minh họa (ví dụ)
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={sampleData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#42a5f5" />
                                </BarChart>
                            </ResponsiveContainer>
                            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                Tỉ lệ học viên hoàn thành khóa học theo kết quả dự đoán (dữ liệu minh họa).
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </DashboardContent>
    );
}
