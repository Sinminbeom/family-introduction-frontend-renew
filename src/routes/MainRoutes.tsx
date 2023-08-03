import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// page routing
const SaveBoardPage = Loadable(lazy(() => import('views/board/SaveBoard')));
const BoardPage = Loadable(lazy(() => import('views/board')));
const ReadBoardPage = Loadable(lazy(() => import('views/board/ReadBoard')));
const CalendarPage = Loadable(lazy(() => import('views/calendar')));

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
            path: '/boards',
            element: <BoardPage />
        },
        {
            path: '/board',
            element: <SaveBoardPage />
        },
        {
            path: '/board/:boardId',
            element: <ReadBoardPage />
        },
        {
            path: '/calendar',
            element: <CalendarPage />
        }
    ]
};

export default MainRoutes;
