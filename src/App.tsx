import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components";
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
    </BrowserRouter>
  );
}

export default App;
