import { useEffect, useState } from 'react';

import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

type DataRow = {
    user_id: string;
    course_id: string;
    completion: number;
    [key: string]: any;
};

type Props = {
    data: DataRow[];
};

export function PredictView({ data }: Props) {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [courseList, setCourseList] = useState<string[]>([]);
    const [studentList, setStudentList] = useState<string[]>([]);
    const [prediction, setPrediction] = useState<number | null>(null);

    useEffect(() => {
        const uniqueCourses = Array.from(new Set(data.map((row) => row.course_id)));
        setCourseList(uniqueCourses);
    }, [data]);

    useEffect(() => {
        if (selectedCourse) {
            const filteredStudents = data
                .filter((row) => row.course_id === selectedCourse)
                .map((row) => row.user_id);
            const uniqueStudents = Array.from(new Set(filteredStudents));
            setStudentList(uniqueStudents);
            setSelectedStudent('');
            setPrediction(null);
        }
    }, [selectedCourse, data]);

    useEffect(() => {
        if (selectedStudent && selectedCourse) {
            const studentData = data.find(
                (row) => row.course_id === selectedCourse && row.user_id === selectedStudent
            );
            if (studentData) {
                setPrediction(studentData.completion * 100); // scale to %
            } else {
                setPrediction(null);
            }
        }
    }, [selectedStudent, selectedCourse, data]);

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Dự đoán mức độ hoàn thành khóa học
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Khóa học</InputLabel>
                    <Select
                        value={selectedCourse}
                        label="Khóa học"
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        {courseList.map((course) => (
                            <MenuItem key={course} value={course}>
                                {course}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }} disabled={!selectedCourse}>
                    <InputLabel>Học sinh</InputLabel>
                    <Select
                        value={selectedStudent}
                        label="Học sinh"
                        onChange={(e) => setSelectedStudent(e.target.value)}
                    >
                        {studentList.map((student) => (
                            <MenuItem key={student} value={student}>
                                {student}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {prediction !== null && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Học sinh</TableCell>
                                <TableCell>Khóa học</TableCell>
                                <TableCell align="right">Dự đoán hoàn thành (%)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{selectedStudent}</TableCell>
                                <TableCell>{selectedCourse}</TableCell>
                                <TableCell align="right">{prediction.toFixed(2)}%</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
