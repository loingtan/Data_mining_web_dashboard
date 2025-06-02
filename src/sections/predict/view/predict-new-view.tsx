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
        setError('No test prediction found for this user-course combination');
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
        Prediction
      </Typography>{' '}
      {/* Form for selecting prediction parameters */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Select Prediction Parameters
          </Typography>{' '}
          <Grid container spacing={3}>
            {' '}
            {/* User Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>User</InputLabel>
                <Select
                  value={selectedUserId}
                  label="User"
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Select a user</em>
                  </MenuItem>
                  {uniqueUserIds.map((userId) => (
                    <MenuItem key={userId} value={userId}>
                      User {userId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>{' '}
            {/* Course Selection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth disabled={!selectedUserId || isLoading}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourseId}
                  label="Course"
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>
                      {selectedUserId
                        ? availableCourseIds.length === 0
                          ? 'No courses available'
                          : 'Select a course'
                        : 'Select a user first'}
                    </em>
                  </MenuItem>
                  {availableCourseIds.map((courseId) => (
                    <MenuItem key={courseId} value={courseId}>
                      Course {courseId}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* Loading indicators */}
          {isLoading && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress />
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                Loading data...
              </Typography>
            </Box>
          )}{' '}
          {/* Selection status */}
          {!isLoading && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Status: {selectedUserId ? '✓ User selected' : '○ Select user'} •{' '}
                {selectedCourseId
                  ? '✓ Course selected'
                  : selectedUserId
                    ? '○ Select course'
                    : '○ Select course (user required)'}
              </Typography>
              {selectedUserId && selectedCourseId && (
                <Typography variant="body2" sx={{ mt: 1 }} color="primary">
                  Ready to view prediction results
                </Typography>
              )}
              {selectedUserId && availableCourseIds.length > 0 && !selectedCourseId && (
                <Typography variant="body2" sx={{ mt: 1 }} color="info.main">
                  {availableCourseIds.length} course(s) available for this user
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
              Prediction Results
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
                    Predicted Completion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Model prediction for course completion percentage
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
                    Actual Completion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real completion percentage from test data
                  </Typography>
                </Box>
              </Grid>{' '}
              {/* Prediction accuracy analysis */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Prediction Accuracy Analysis
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                    <Typography variant="body2">
                      <strong>Prediction Error:</strong>{' '}
                      {Math.abs(
                        selectedPrediction.actual_completion -
                          selectedPrediction.predicted_completion
                      ).toFixed(3)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Error Percentage:</strong>{' '}
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
                      <strong>Excellent Prediction!</strong> Error less than 10%. The model
                      performed very well for this case.
                    </Alert>
                  ) : Math.abs(
                      selectedPrediction.actual_completion - selectedPrediction.predicted_completion
                    ) < 0.2 ? (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <strong>Good Prediction.</strong> Error between 10-20%. The model performed
                      reasonably well.
                    </Alert>
                  ) : (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <strong>Poor Prediction.</strong> Error greater than 20%. The model needs
                      significant improvement.
                    </Alert>
                  )}
                </Box>
              </Grid>{' '}
              {/* Detailed metadata */}
              <Grid size={{ xs: 12 }}>
                <Box sx={{ p: 3, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Prediction Details
                  </Typography>{' '}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Prediction ID
                      </Typography>{' '}
                      <Typography variant="body1">{selectedPrediction.prediction_id}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Model ID
                      </Typography>{' '}
                      <Typography variant="body1">{selectedPrediction.model_id}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        User ID
                      </Typography>{' '}
                      <Typography variant="body1">{selectedPrediction.user_id}</Typography>{' '}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Course ID
                      </Typography>
                      <Typography variant="body1">{selectedPrediction.course_id}</Typography>
                    </Grid>{' '}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
      {/* Instructions when no prediction selected */}
      {!selectedPrediction && !error && !isLoading && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Instructions
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              To view test prediction results:
            </Typography>{' '}
            <Box component="ol" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Choose a user from the available user IDs in the test data
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Select a course from the available course IDs in the test data
              </Typography>
              <Typography component="li" variant="body2">
                View the predicted vs actual completion results with accuracy analysis
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Note: This page shows pre-calculated test predictions, not real-time predictions. The
              data comes from historical test sets used to evaluate model performance.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
