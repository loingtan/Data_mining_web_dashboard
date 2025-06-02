import React, { useMemo, useState } from 'react';
import {
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
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
import CircularProgress from '@mui/material/CircularProgress';

import {
  useTestPredictions,
  usePredictionModels,
  type FeatureImportance,
  type PerformanceMetrics,
} from 'src/utils/api';

// ----------------------------------------------------------------------

export function ModelHubView() {
  const { data: models, isLoading, error } = usePredictionModels();
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const { data: testPredictions, isLoading: isPredictionsLoading } =
    useTestPredictions(selectedModelId);

  const selectedModel = useMemo(() => {
    if (!models || !selectedModelId) return null;
    return models.find((model) => model.model_id === selectedModelId) || null;
  }, [models, selectedModelId]);

  const performanceMetrics = useMemo(() => {
    if (!selectedModel) return null;
    try {
      return JSON.parse(selectedModel.performance_metrics_json) as PerformanceMetrics;
    } catch {
      return null;
    }
  }, [selectedModel]);

  const featureImportance = useMemo(() => {
    if (!selectedModel) return null;
    try {
      const importanceData = JSON.parse(selectedModel.feature_importance_json) as FeatureImportance;
      // Convert to array and sort by importance
      return Object.entries(importanceData)
        .map(([feature, value]) => ({ feature, importance: value }))
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 7); // Top 7 features
    } catch {
      return null;
    }
  }, [selectedModel]);

  const hyperparameters = useMemo(() => {
    if (!selectedModel) return null;
    try {
      return JSON.parse(selectedModel.hyperparameters_json);
    } catch {
      return null;
    }
  }, [selectedModel]);

  // Set first model as default when models load
  React.useEffect(() => {
    if (models && models.length > 0 && !selectedModelId) {
      setSelectedModelId(models[0].model_id);
    }
  }, [models, selectedModelId]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Không thể tải dữ liệu mô hình. Vui lòng thử lại sau.</Alert>;
  }

  if (!models || models.length === 0) {
    return <Alert severity="info">Không có mô hình nào được tìm thấy.</Alert>;
  }

  const getMetricExplanation = (metric: string, value: number) => {
    switch (metric) {
      case 'r2':
        return `R² = ${value.toFixed(3)} cho thấy mô hình giải thích được ${(value * 100).toFixed(1)}% sự biến thiên trong dữ liệu mức độ hoàn thành.`;
      case 'rmse':
        return `RMSE = ${value.toFixed(3)} cho thấy sai số trung bình bình phương của mô hình.`;
      case 'mae':
        return `MAE = ${value.toFixed(3)} cho thấy sai số tuyệt đối trung bình của mô hình.`;
      case 'mape':
        return `MAPE = ${(value * 100).toFixed(1)}% cho thấy phần trăm sai số tuyệt đối trung bình.`;
      default:
        return '';
    }
  };

  const getFeatureExplanation = (feature: string) => {
    const explanations: { [key: string]: string } = {
      problem_chapter:
        'Chương bài tập - Thứ tự chương trong khóa học ảnh hưởng đến khả năng hoàn thành',
      total_correct_answer_week1:
        'Tổng số câu trả lời đúng tuần 1 - Chỉ số quan trọng về hiệu suất học tập ban đầu',
      problem_index: 'Chỉ số bài tập - Vị trí của bài tập trong chuỗi học tập',
      course_num_problems: 'Số lượng bài tập trong khóa học - Độ phức tạp tổng thể của khóa học',
      problem_type: 'Loại bài tập - Dạng thức bài tập ảnh hưởng đến độ khó',
      course_num_videos: 'Số lượng video trong khóa học - Tài nguyên học tập có sẵn',
      problem_done_week1: 'Số bài tập hoàn thành tuần 1 - Mức độ tích cực trong học tập',
      course_num_exercises: 'Số lượng bài tập trong khóa học',
      course_avg_completion_rate: 'Tỷ lệ hoàn thành trung bình của khóa học',
      course_total_completion_rate: 'Tỷ lệ hoàn thành tổng thể của khóa học',
    };
    return explanations[feature] || `Đặc trưng: ${feature}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        🎯 Trung Tâm Mô Hình Dự Đoán
      </Typography>

      <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
        Thông Tin Mô Hình Dự Đoán
      </Typography>

      {/* Tabs for Model Info and Predictions */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Thông Tin Mô Hình" />
          <Tab label="Kết Quả Dự Đoán" disabled={!selectedModelId} />
        </Tabs>
      </Box>

      {/* Tab Content - Model Info */}
      {tabValue === 0 && (
        <Box>
          {/* Phần 1: Lựa chọn Mô Hình */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                🔧 Lựa Chọn Mô Hình
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                  <FormControl fullWidth>
                    <InputLabel>Chọn Mô Hình</InputLabel>
                    <Select
                      value={selectedModelId || ''}
                      onChange={(e) => setSelectedModelId(Number(e.target.value))}
                      label="Chọn Mô Hình"
                    >
                      {models.map((model) => (
                        <MenuItem key={model.model_id} value={model.model_id}>
                          {model.model_name} ({model.model_version})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {selectedModel && (
                  <Box sx={{ flex: '1 1 300px', minWidth: 300 }}>
                    <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Thông Tin Mô Hình
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Tên:</strong> {selectedModel.model_name}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Thuật toán:</strong> {selectedModel.algorithm_used}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Phiên bản:</strong> {selectedModel.model_version}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Tuần:</strong> {selectedModel.week}
                      </Typography>
                      <Chip
                        label={
                          selectedModel.is_active === 'True' ? 'Đang hoạt động' : 'Không hoạt động'
                        }
                        color={selectedModel.is_active === 'True' ? 'success' : 'default'}
                        size="small"
                      />
                    </Paper>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {selectedModel && performanceMetrics && (
            <>
              {/* Phần 2: Hiệu Suất Mô Hình */}
              <Card sx={{ mb: 4 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    📊 Hiệu Suất Mô Hình
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                          Dữ Liệu Test
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 1,
                              backgroundColor: 'primary.lighter',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="h6" color="primary.main">
                              {(performanceMetrics.test.r2 * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="body2">R²</Typography>
                          </Box>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 1,
                              backgroundColor: 'secondary.lighter',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="h6" color="secondary.main">
                              {performanceMetrics.test.rmse.toFixed(4)}
                            </Typography>
                            <Typography variant="body2">RMSE</Typography>
                          </Box>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 1,
                              backgroundColor: 'success.lighter',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="h6" color="success.main">
                              {performanceMetrics.test.mae.toFixed(4)}
                            </Typography>
                            <Typography variant="body2">MAE</Typography>
                          </Box>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 1,
                              backgroundColor: 'warning.lighter',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="h6" color="warning.main">
                              {(performanceMetrics.test.mape * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="body2">MAPE</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>

                    <Box sx={{ flex: '1 1 400px', minWidth: 400 }}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                          Dữ Liệu Train
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 1,
                              backgroundColor: 'primary.lighter',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="h6" color="primary.main">
                              {(performanceMetrics.train.r2 * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="body2">R²</Typography>
                          </Box>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 1,
                              backgroundColor: 'secondary.lighter',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="h6" color="secondary.main">
                              {performanceMetrics.train.rmse.toFixed(4)}
                            </Typography>
                            <Typography variant="body2">RMSE</Typography>
                          </Box>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 1,
                              backgroundColor: 'success.lighter',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="h6" color="success.main">
                              {performanceMetrics.train.mae.toFixed(4)}
                            </Typography>
                            <Typography variant="body2">MAE</Typography>
                          </Box>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 1,
                              backgroundColor: 'warning.lighter',
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="h6" color="warning.main">
                              {(performanceMetrics.train.mape * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="body2">MAPE</Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      📈 Giải Thích Chỉ Số
                    </Typography>
                    <Stack spacing={1}>
                      <Alert severity="info">
                        {getMetricExplanation('r2', performanceMetrics.test.r2)}
                      </Alert>
                      <Alert severity="info">
                        {getMetricExplanation('rmse', performanceMetrics.test.rmse)}
                      </Alert>
                      <Alert severity="info">
                        {getMetricExplanation('mae', performanceMetrics.test.mae)}
                      </Alert>
                      <Alert severity="info">
                        {getMetricExplanation('mape', performanceMetrics.test.mape)}
                      </Alert>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

              {/* Phần 3: Các Đặc Trưng Quan Trọng */}
              {featureImportance && (
                <Card sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                      🎯 Các Đặc Trưng Quan Trọng Nhất
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        📊 Biểu Đồ Độ Quan Trọng Đặc Trưng
                      </Typography>
                      <Paper sx={{ p: 2, height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={featureImportance}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="feature"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              fontSize={12}
                            />
                            <YAxis />
                            <Tooltip
                              formatter={(value: number) => [
                                `${(value * 100).toFixed(2)}%`,
                                'Độ quan trọng',
                              ]}
                            />
                            <Bar dataKey="importance" fill="#8884d8">
                              {featureImportance.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </Paper>
                    </Box>

                    <Typography variant="h6" sx={{ mb: 2 }}>
                      📝 Giải Thích Đặc Trưng
                    </Typography>
                    <Stack spacing={2}>
                      {featureImportance.map((item, index) => (
                        <Alert key={item.feature} severity="info">
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            #{index + 1} {item.feature} ({(item.importance * 100).toFixed(2)}%)
                          </Typography>
                          <Typography variant="body2">
                            {getFeatureExplanation(item.feature)}
                          </Typography>
                        </Alert>
                      ))}
                    </Stack>

                    {hyperparameters && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          ⚙️ Tham Số Mô Hình
                        </Typography>
                        <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
                          <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                              gap: 2,
                            }}
                          >
                            {Object.entries(hyperparameters).map(([param, value]) => (
                              <Box key={param}>
                                <Typography variant="body2">
                                  <strong>{param}:</strong> {String(value)}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Paper>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Box>
      )}

      {/* Tab Content - Predictions */}
      {tabValue === 1 && selectedModelId && (
        <Card>
          <CardContent>
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              🔮 Kết Quả Dự Đoán Test
            </Typography>

            {isPredictionsLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
              </Box>
            ) : testPredictions && testPredictions.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User ID</TableCell>
                      <TableCell>Course ID</TableCell>
                      <TableCell align="right">Actual Completion</TableCell>
                      <TableCell align="right">Predicted Completion</TableCell>
                      <TableCell align="right">Prediction Error</TableCell>
                      <TableCell>Set Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {' '}
                    {testPredictions.slice(0, 20).map((prediction) => {
                      const predictionError = Math.abs(
                        prediction.actual_completion - prediction.predicted_completion
                      );
                      const errorPercent = (predictionError * 100).toFixed(2);

                      return (
                        <TableRow key={prediction.prediction_id}>
                          <TableCell>{prediction.user_id}</TableCell>
                          <TableCell>{prediction.course_id}</TableCell>
                          <TableCell align="right">
                            {(prediction.actual_completion * 100).toFixed(2)}%
                          </TableCell>
                          <TableCell align="right">
                            {(prediction.predicted_completion * 100).toFixed(2)}%
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              color={
                                predictionError < 0.1
                                  ? 'success.main'
                                  : predictionError < 0.2
                                    ? 'warning.main'
                                    : 'error.main'
                              }
                            >
                              {errorPercent}%
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={prediction.set_type}
                              size="small"
                              color={prediction.set_type === 'test' ? 'primary' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Alert severity="info">Không có dữ liệu dự đoán test cho mô hình này.</Alert>
            )}

            {testPredictions && testPredictions.length > 20 && (
              <Typography
                variant="body2"
                sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}
              >
                Hiển thị 20 kết quả đầu tiên trong tổng số {testPredictions.length} kết quả
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
