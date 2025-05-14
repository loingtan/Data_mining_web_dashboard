import { useEffect, useState } from 'react';

import { DashboardContent } from 'src/layouts/dashboard/content';

import { PredictView } from 'src/sections/predict/view/predict-view';

export default function PredictPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://pnqljxlcqfeubrtfrbvv.supabase.co/functions/v1/query-user-completion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucWxqeGxjcWZldWJydGZyYnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMzg1MjgsImV4cCI6MjA2MjcxNDUyOH0.3i_FHI-DFUXQUdSOuZFtxdH4GwRzv8FVb-9jD9G7TYM',
                    },
                    body: JSON.stringify({ name: 'Functions' }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data from Supabase');
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ Supabase:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <DashboardContent>Đang tải dữ liệu dự đoán...</DashboardContent>;
    }

    return (
        <>
            <title>Predict - Dashboard</title>
            <PredictView data={data} />
        </>
    );
}
