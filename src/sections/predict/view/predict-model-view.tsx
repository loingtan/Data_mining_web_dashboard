import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

interface Props {
  modelId: number;
}

interface PredictionForm {
  user_id: string;
  course_id: string;
  problem_chapter: number;
  total_correct_answer_week1: number;
  problem_index: number;
  course_num_problems: number;
  problem_type: number;
  course_num_videos: number;
  problem_done_week1: number;
}

interface PredictionResult {
  predicted_completion: number;
  confidence: number;
}

export function PredictModelView({ modelId }: Props) {
  const [formData, setFormData] = useState<PredictionForm>({
    user_id: '',
    course_id: '',
    problem_chapter: 1,
    total_correct_answer_week1: 0,
    problem_index: 1,
    course_num_problems: 10,
    problem_type: 1,
    course_num_videos: 5,
    problem_done_week1: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange =
    (field: keyof PredictionForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === 'number' ? Number(event.target.value) : event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call for prediction
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock prediction result
      const mockResult: PredictionResult = {
        predicted_completion: Math.random() * 0.8 + 0.2, // Between 0.2 and 1.0
        confidence: Math.random() * 0.3 + 0.7, // Between 0.7 and 1.0
      };

      setResult(mockResult);
    } catch {
      setError('Có lỗi xảy ra khi thực hiện dự đoán. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.user_id && formData.course_id;

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                📝 Thông Tin Dữ Liệu Đầu Vào
              </Typography>

              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="User ID"
                  value={formData.user_id}
                  onChange={handleInputChange('user_id')}
                  placeholder="Nhập mã học viên"
                  required
                />

                <TextField
                  label="Course ID"
                  value={formData.course_id}
                  onChange={handleInputChange('course_id')}
                  placeholder="Nhập mã khóa học"
                  required
                />

                <TextField
                  label="Chương bài tập"
                  type="number"
                  value={formData.problem_chapter}
                  onChange={handleInputChange('problem_chapter')}
                  inputProps={{ min: 1, max: 20 }}
                />

                <TextField
                  label="Tổng câu trả lời đúng tuần 1"
                  type="number"
                  value={formData.total_correct_answer_week1}
                  onChange={handleInputChange('total_correct_answer_week1')}
                  inputProps={{ min: 0, max: 100 }}
                />

                <TextField
                  label="Chỉ số bài tập"
                  type="number"
                  value={formData.problem_index}
                  onChange={handleInputChange('problem_index')}
                  inputProps={{ min: 1, max: 100 }}
                />

                <TextField
                  label="Số lượng bài tập trong khóa học"
                  type="number"
                  value={formData.course_num_problems}
                  onChange={handleInputChange('course_num_problems')}
                  inputProps={{ min: 1, max: 500 }}
                />

                <TextField
                  label="Loại bài tập"
                  type="number"
                  value={formData.problem_type}
                  onChange={handleInputChange('problem_type')}
                  inputProps={{ min: 1, max: 10 }}
                />

                <TextField
                  label="Số lượng video trong khóa học"
                  type="number"
                  value={formData.course_num_videos}
                  onChange={handleInputChange('course_num_videos')}
                  inputProps={{ min: 1, max: 100 }}
                />

                <TextField
                  label="Bài tập hoàn thành tuần 1"
                  type="number"
                  value={formData.problem_done_week1}
                  onChange={handleInputChange('problem_done_week1')}
                  inputProps={{ min: 0, max: 100 }}
                />

                <Button
                  variant="contained"
                  onClick={handlePredict}
                  disabled={!isFormValid || isLoading}
                  size="large"
                  sx={{ mt: 2 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : '🔮 Thực Hiện Dự Đoán'}
                </Button>
              </Box>
            </CardContent>
          </Card>{' '}
        </Grid>

        <Grid item xs={12} md={6} {...({} as any)}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                🎯 Kết Quả Dự Đoán
              </Typography>

              {isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                  <CircularProgress />
                  <Typography sx={{ ml: 2 }}>Đang thực hiện dự đoán...</Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Box>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Dự đoán hoàn tất thành công!
                  </Alert>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      p: 3,
                      backgroundColor: 'grey.50',
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                        {(result.predicted_completion * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Tỷ lệ hoàn thành dự đoán
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" color="success.main">
                        {(result.confidence * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Độ tin cậy của dự đoán
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        📊 Thông tin mô hình:
                      </Typography>
                      <Typography variant="body2">• Model ID: {modelId}</Typography>
                      <Typography variant="body2">
                        • Dự đoán dựa trên {Object.keys(formData).length} đặc trưng đầu vào
                      </Typography>
                      <Typography variant="body2">
                        • Thời gian dự đoán: {new Date().toLocaleString('vi-VN')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {!result && !isLoading && !error && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '200px',
                    flexDirection: 'column',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    🔮
                  </Typography>{' '}
                  <Typography variant="body1">
                    Nhập thông tin và nhấn &quot;Thực Hiện Dự Đoán&quot;
                  </Typography>
                  <Typography variant="body2">để xem kết quả dự đoán tỷ lệ hoàn thành</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
