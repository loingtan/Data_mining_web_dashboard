import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import LinearProgress from '@mui/material/LinearProgress';

import { useTestPredictions } from 'src/utils/api';

// Adjust the path as necessary
export interface TestPrediction {
  user_id: string;
  course_id: string;
  actual_completion: number;
  predicted_completion: number;
  model_id: number;
  output_predict_json: string;
  set_type: string;
  prediction_id: string;
}

export function PredictNewView() {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedPrediction, setSelectedPrediction] = useState<TestPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use API hook instead of CSV loading
  const { data: testPredictions, isLoading: predictionsLoading } = useTestPredictions();

  // Find prediction when user/course combination is selected
  useEffect(() => {
    if (selectedUserId && selectedCourseId && testPredictions) {
      const userId = selectedUserId;
      const courseId = selectedCourseId;

      const prediction = testPredictions.find(
        (p) => p.user_id === userId && p.course_id === courseId
      );

      if (prediction) {
        setSelectedPrediction(prediction);
        setError(null);
      } else {
        setSelectedPrediction(null);
        setError('Không tìm thấy dự đoán kiểm tra cho tổ hợp người dùng-khóa học này');
      }
    } else {
      setSelectedPrediction(null);
      setError(null);
    }
  }, [selectedUserId, selectedCourseId, testPredictions]);

  // Reset course selection when user changes
  useEffect(() => {
    if (selectedUserId) {
      setSelectedCourseId('');
    }
  }, [selectedUserId]);

  const isLoading = predictionsLoading;

  // Get unique user_ids from test predictions
  const uniqueUserIds = [...new Set(testPredictions?.map((p) => p.user_id) || [])];

  const availableCourseIds =
    selectedUserId && testPredictions
      ? [
          ...new Set(
            testPredictions.filter((p) => p.user_id === selectedUserId).map((p) => p.course_id)
          ),
        ]
      : [];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dự Đoán
      </Typography>{' '}
      {/* Form for selecting prediction parameters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Chọn Tham Số Dự Đoán
          </Typography>{' '}
          <Grid container spacing={3}>
            {' '}
            {/* User Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Người Dùng</InputLabel>
                <Select
                  value={selectedUserId}
                  label="Người Dùng"
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Chọn một người dùng</em>
                  </MenuItem>
                  {uniqueUserIds.map((userId) => (
                    <MenuItem key={userId} value={userId}>
                      Người dùng {userId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>{' '}
            {/* Course Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={!selectedUserId || isLoading}>
                <InputLabel>Khóa Học</InputLabel>
                <Select
                  value={selectedCourseId}
                  label="Khóa Học"
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>
                      {selectedUserId
                        ? availableCourseIds.length === 0
                          ? 'Không có khóa học nào'
                          : 'Chọn một khóa học'
                        : 'Chọn người dùng trước'}
                    </em>
                  </MenuItem>
                  {availableCourseIds.map((courseId) => (
                    <MenuItem key={courseId} value={courseId}>
                      Khóa học {courseId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>{' '}
          {/* Loading indicators */}
          {isLoading && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                Đang tải dữ liệu...
              </Typography>
            </Box>
          )}{' '}
          {/* Selection status */}
          {!isLoading && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Trạng thái: {selectedUserId ? '✓ Đã chọn người dùng' : '○ Chọn người dùng'} •{' '}
                {selectedCourseId
                  ? '✓ Đã chọn khóa học'
                  : selectedUserId
                    ? '○ Chọn khóa học'
                    : '○ Chọn khóa học (cần chọn người dùng)'}
              </Typography>
              {selectedUserId && selectedCourseId && (
                <Typography variant="body2" sx={{ mt: 1 }} color="primary">
                  Sẵn sàng xem kết quả dự đoán
                </Typography>
              )}
              {selectedUserId && availableCourseIds.length > 0 && !selectedCourseId && (
                <Typography variant="body2" sx={{ mt: 1 }} color="info.main">
                  {availableCourseIds.length} khóa học có sẵn cho người dùng này
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
      {/* Error message */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {/* Prediction Results */}
      {selectedPrediction && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Kết Quả Dự Đoán
            </Typography>{' '}
            <Grid container spacing={3}>
              {' '}
              {/* Main prediction results */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 3, backgroundColor: 'primary.lighter', borderRadius: 2 }}>
                  <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                    {(selectedPrediction.predicted_completion * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Tỷ Lệ Hoàn Thành Dự Đoán
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dự đoán của mô hình về tỷ lệ phần trăm hoàn thành khóa học
                  </Typography>
                </Box>
              </Grid>{' '}
              {/* Actual results for comparison */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ p: 3, backgroundColor: 'success.lighter', borderRadius: 2 }}>
                  <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                    {(selectedPrediction.actual_completion * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Tỷ Lệ Hoàn Thành Thực Tế
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tỷ lệ phần trăm hoàn thành thực tế từ dữ liệu kiểm tra
                  </Typography>
                </Box>
              </Grid>{' '}
              {/* Prediction accuracy analysis */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Phân Tích Độ Chính Xác Dự Đoán
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Sai Số Dự Đoán:</strong>{' '}
                      {Math.abs(
                        selectedPrediction.actual_completion -
                          selectedPrediction.predicted_completion
                      ).toFixed(3)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tỷ Lệ Sai Số:</strong>{' '}
                      {(
                        Math.abs(
                          selectedPrediction.actual_completion -
                            selectedPrediction.predicted_completion
                        ) * 100
                      ).toFixed(1)}
                      %
                    </Typography>
                  </Box>

                  {/* Accuracy assessment */}
                  {Math.abs(
                    selectedPrediction.actual_completion - selectedPrediction.predicted_completion
                  ) < 0.1 ? (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <strong>Dự Đoán Xuất Sắc!</strong> Sai số nhỏ hơn 10%. Mô hình hoạt động rất
                      tốt cho trường hợp này.
                    </Alert>
                  ) : Math.abs(
                      selectedPrediction.actual_completion - selectedPrediction.predicted_completion
                    ) < 0.2 ? (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <strong>Dự Đoán Tốt.</strong> Sai số từ 10-20%. Mô hình hoạt động khá tốt.
                    </Alert>
                  ) : (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <strong>Dự Đoán Kém.</strong> Sai số lớn hơn 20%. Mô hình cần cải thiện đáng
                      kể.
                    </Alert>
                  )}
                </Box>
              </Grid>{' '}
              {/* Detailed metadata */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Chi Tiết Dự Đoán
                  </Typography>{' '}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        ID Dự Đoán
                      </Typography>{' '}
                      <Typography variant="body1">{selectedPrediction.prediction_id}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        ID Mô Hình
                      </Typography>{' '}
                      <Typography variant="body1">{selectedPrediction.model_id}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        ID Người Dùng
                      </Typography>{' '}
                      <Typography variant="body1">{selectedPrediction.user_id}</Typography>{' '}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        ID Khóa Học
                      </Typography>
                      <Typography variant="body1">{selectedPrediction.course_id}</Typography>
                    </Grid>{' '}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}{' '}
      {/* Instructions when no prediction selected */}
      {!selectedPrediction && !error && !isLoading && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Hướng Dẫn
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Để xem kết quả dự đoán kiểm tra:
            </Typography>{' '}
            <Box component="ol" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Chọn một người dùng từ danh sách ID người dùng có sẵn trong dữ liệu kiểm tra
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Chọn một khóa học từ danh sách ID khóa học có sẵn trong dữ liệu kiểm tra
              </Typography>
              <Typography component="li" variant="body2">
                Xem kết quả dự đoán so với thực tế cùng với phân tích độ chính xác
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Lưu ý: Trang này hiển thị các dự đoán kiểm tra đã được tính toán trước, không phải dự
              đoán thời gian thực. Dữ liệu được lấy từ các bộ kiểm tra lịch sử được sử dụng để đánh
              giá hiệu suất mô hình.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
