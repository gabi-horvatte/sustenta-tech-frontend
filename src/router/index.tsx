import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router';
import { Login } from '../modules/IAM/Login';
import { AnimatePresence, motion as m } from 'framer-motion';
import { Home } from '@/modules/Management/Home';
import { IAMProvider } from '@/modules/IAM/context/provider';
import { NotificationProvider } from '@/modules/Notifications/context/provider';
import { Header } from '@/components/header';
import { Classrooms } from '@/modules/Management/Classroom/Classrooms';
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';
import { IAMContext } from '@/modules/IAM/context/context';
import { Classroom } from '@/modules/Management/Classroom/Classroom';
import { Student } from '@/modules/Management/Classroom/Student';
import { Activities } from '@/modules/Management/Activities/Activities';
import { Activity } from '@/modules/Management/Activities/Activity';
import { Materials } from '@/modules/Management/Materials/Materials';
import { StudentHome } from '@/modules/Students/Home';
import { Account } from '@/modules/IAM/Account';
import { StudentActivities } from '@/modules/Students/StudentActivities';
import { StudentMaterials } from '@/modules/Students/Materials';
import { GlobalHome } from '@/modules/GlobalHome';

function LayoutWithHeader() {
  const location = useLocation();

  // Header everywhere inside this layout; PageWrapper wraps each page
  return (
    <div className="h-[100vh] flex flex-col">
      <Header />
      <AnimatePresence mode="wait">
        <PageWrapper key={location.pathname}>
          <Outlet />
        </PageWrapper>
      </AnimatePresence>
    </div>
  );
}

function LoginLayout() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <PageWrapper key={location.pathname}>
        <Login />
      </PageWrapper>
    </AnimatePresence>
  );
}

export const AppRouter = () => {

  return (
    <BrowserRouter>
      <IAMProvider>
        <NotificationProvider>
          <Routes>
            <Route element={<LayoutWithHeader />}>
              <Route path="/" element={<GlobalHome />} />
              <Route path="/management" element={<Home />} />
              <Route path="/management/home" element={<Home />} />
              <Route path="/management/classroom" element={<Classrooms />} />
              <Route path="/management/classroom/:classroomId" element={<Classroom />} />
              <Route path="/management/classroom/student/:studentId" element={<Student />} />
              <Route path="/management/activities" element={<Activities />} />
              <Route path="/management/activities/activity/:activityId" element={<Activity />} />
              <Route path="/management/materials" element={<Materials />} />
              <Route path="/student/home" element={<StudentHome />} />
              <Route path="/student" element={<StudentHome />} />
              <Route path="/students/activities" element={<StudentActivities />} />
              <Route path="/students/materials" element={<StudentMaterials />} />
              <Route path="/account" element={<Account />} />
            </Route>
            <Route path="/login" element={<LoginLayout />} />
          </Routes>
        </NotificationProvider>
      </IAMProvider>
    </BrowserRouter>
  )
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { hasVerifiedToken } = useContext(IAMContext);
  const navigate = useNavigate();
  const { user } = useContext(IAMContext);

  if (!hasVerifiedToken)
    return <Loader2 className="w-32 h-32 animate-spin fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
  
  if (user?.role === 'STUDENT' && location.pathname.startsWith('/management')) {
    navigate('/student/home');
  } else if (user?.role === 'TEACHER' && location.pathname.startsWith('/student')) {
    navigate('/management/home');
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
      className="h-full"
    >
      {children}
    </m.div>
  )
};