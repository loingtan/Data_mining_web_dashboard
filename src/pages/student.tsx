import { useEffect, useState } from 'react';

import { DashboardContent } from 'src/layouts/dashboard/content';

import { StudentDashboardView } from 'src/sections/student/view/student-dashboard-view';

// Tạm thời hardcode, sau này bạn có thể lấy từ context hoặc localStorage
const studentId = '12345'; // Thay bằng ID học viên thật

export default function StudentPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://pnqljxlcqfeubrtfrbvv.supabase.co/functions/v1/query-user-completion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucWxqeGxjcWZldWJydGZyYnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzg1MjgsImV4cCI6MjA2MjcxNDUyOH0.3i_FHI-DFUXQUdSOuZFtxdH4GwRzv8FVb-9jD9G7TYM'
                    },
                    body: JSON.stringify({ name: 'Functions' }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data from API');
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <DashboardContent>Đang tải dữ liệu học viên...</DashboardContent>;
    }

    return (
        <>
            <title>Student - Dashboard</title>
            <StudentDashboardView data={data} studentId={studentId} />
        </>
    );
}
