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
import { ClassroomWithTabs } from '@/modules/Management/Classroom/ClassroomWithTabs';
import { Student } from '@/modules/Management/Classroom/Student';
import { ActivitiesWithTabs } from '@/modules/Management/Activities/ActivitiesWithTabs';
import { Activity } from '@/modules/Management/Activities/Activity';
import { MaterialsWithTabs } from '@/modules/Management/Materials/MaterialsWithTabs';
import { StudentHome } from '@/modules/Students/Home';
import { Account } from '@/modules/IAM/Account';
import { StudentActivities } from '@/modules/Students/StudentActivities';
// import { StudentMaterials } from '@/modules/Students/Materials';
import { StudentMaterials as NewStudentMaterials } from '@/modules/Students/StudentMaterials';
import { QuizActivity } from '@/modules/Students/QuizActivity';
import { QuizReview } from '@/modules/Students/QuizReview';
import { GlobalHome } from '@/modules/GlobalHome';
import { CreateActivityTemplate } from '@/modules/Management/ActivityTemplates/CreateActivityTemplate';
import { EditActivityTemplate } from '@/modules/Management/ActivityTemplates/EditActivityTemplate';
import { ActivityTemplateLibrary } from '@/modules/Management/ActivityTemplates/ActivityTemplateLibrary';
import { ViewActivityTemplate } from '@/modules/Management/ActivityTemplates/ViewActivityTemplate';
import { AssignActivity } from '@/modules/Management/ActivityTemplates/AssignActivity';
import { CreateMaterialTemplate } from '@/modules/Management/MaterialTemplates/CreateMaterialTemplate';
import { EditMaterialTemplate } from '@/modules/Management/MaterialTemplates/EditMaterialTemplate';
import { AssignMaterial } from '@/modules/Management/MaterialTemplates/AssignMaterial';
import { MaterialAssignmentDetail } from '@/modules/Management/Materials/MaterialAssignmentDetail';

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
              <Route path="/management/classroom/:classroomId" element={<ClassroomWithTabs />} />
              <Route path="/management/classroom/student/:studentId" element={<Student />} />
              <Route path="/management/activities" element={<ActivitiesWithTabs />} />
              <Route path="/management/activities/activity/:activityId" element={<Activity />} />
              <Route path="/management/materials" element={<MaterialsWithTabs />} />
              
              {/* Activity Templates */}
              <Route path="/management/activity-templates" element={<ActivityTemplateLibrary />} />
              <Route path="/management/activity-templates/create" element={<CreateActivityTemplate />} />
              <Route path="/management/activity-templates/edit/:id" element={<EditActivityTemplate />} />
              <Route path="/management/activity-templates/:templateId" element={<ViewActivityTemplate />} />
              <Route path="/management/activity-templates/:templateId/assign" element={<AssignActivity />} />
              
              {/* Material Templates */}
              <Route path="/management/material-templates/create" element={<CreateMaterialTemplate />} />
              <Route path="/management/material-templates/edit/:id" element={<EditMaterialTemplate />} />
              <Route path="/management/material-templates/assign" element={<AssignMaterial />} />
              <Route path="/management/materials/assignment/:assignmentId" element={<MaterialAssignmentDetail />} />
              <Route path="/student/home" element={<StudentHome />} />
              <Route path="/student" element={<StudentHome />} />
              <Route path="/student/activities" element={<StudentActivities />} />
              <Route path="/students/materials" element={<NewStudentMaterials />} />
              <Route path="/student/quiz/:activityId" element={<QuizActivity />} />
              <Route path="/student/quiz/:activityId/review" element={<QuizReview />} />
              
              {/* Management routes for quiz review */}
              <Route path="/management/student/quiz/:activityId/review" element={<QuizReview />} />
              
              {/* Legacy routes for backward compatibility */}
              <Route path="/students/activities" element={<StudentActivities />} />
              {/* <Route path="/students/materials" element={<StudentMaterials />} /> */}
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