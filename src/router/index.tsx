import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { Login } from '../modules/IAM/Login';
import { AnimatePresence, motion as m } from 'framer-motion';
import { Home } from '@/modules/Management/Home';
import { IAMProvider } from '@/modules/IAM/context/provider';
import { Header } from '@/components/header';
import { Classrooms } from '@/modules/Management/Classroom';

function LayoutWithHeader() {
  // Header everywhere inside this layout; PageWrapper wraps each page
  return (
    <div className="max-h-full">
      <Header />
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    </div>
  );
}


export const AppRouter = () => {
  return (
    <BrowserRouter>
      <IAMProvider>
      <AnimatePresence mode="popLayout">
        <Routes>
          <Route element={<LayoutWithHeader />}>
            <Route path="/" element={<Home />} />
            <Route path="/management/home" element={<Home />} />
            <Route path="/management/classroom" element={<Classrooms />} />
          </Route>
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        </Routes>
      </AnimatePresence>
      </IAMProvider>
    </BrowserRouter>
  )
}

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <m.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
    exit={{ opacity: 0, y: -12, transition: { duration: 0.18 } }}
    className="h-full"
  >
    {children}
  </m.div>
);