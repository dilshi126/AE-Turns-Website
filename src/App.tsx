import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components";
import { SiteContentProvider } from "./site-content";
import {
  AboutPage,
  CareersPage,
  ContactPage,
  HomePage,
  NotFoundPage,
  PrivacyPage,
  SolutionsPage,
  TermsPage,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <SiteContentProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="solutions" element={<SolutionsPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </SiteContentProvider>
    </BrowserRouter>
  );
}

export default App;
