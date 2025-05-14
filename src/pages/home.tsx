import dataset from 'src/data/dataset_final.json';

import { HomeView } from 'src/sections/home/view/home-view';

export default function HomePage() {
    return (
        <>
            <title>Home - Dashboard</title>
            <HomeView data={dataset} />
        </>
    );
}
