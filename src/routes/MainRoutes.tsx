import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// sample page routing
const BoardPage = Loadable(lazy(() => import('views/board')));
const ReadBoardPage = Loadable(lazy(() => import('views/board/ReadBoard')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/board',
            element: <BoardPage />
        },
        {
            path: '/board/:boardId',
            element: <ReadBoardPage />
        }
    ]
};

export default MainRoutes;
