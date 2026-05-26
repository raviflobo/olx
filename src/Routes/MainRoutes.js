import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from '../Components/Auth/ProtectedRoute';
import DealerRoute from '../Components/Auth/DealerRoute';
import ScrollToTop from '../Components/Navigation/ScrollToTop';
import TopProgressBar from '../Components/Loading/TopProgressBar';
import Home from '../Pages/Home';
import CarDetail from '../Pages/CarDetail';
import SearchResults from '../Pages/SearchResults';
import DealerLogin from '../Pages/DealerLogin';
import DealerOnboarding from '../Pages/DealerOnboarding';
import DealerDashboard from '../Pages/DealerDashboard';
import AddCar from '../Pages/AddCar';
import EditCar from '../Pages/EditCar';
import DealerProfile from '../Pages/DealerProfile';
import ForgotPasswordPage from '../Pages/ForgotPassword';
import PrivacyPage from '../Pages/PrivacyPage';
import NotFound from '../Pages/NotFound';

function MainRoutes() {
  return (
    <Router basename={process.env.PUBLIC_URL || ''}>
      <TopProgressBar />
      <ScrollToTop />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/car/:id">
          <CarDetail />
        </Route>
        <Route path="/search">
          <SearchResults />
        </Route>
        <Route path="/dealer/login">
          <DealerLogin />
        </Route>
        <ProtectedRoute path="/dealer/onboarding">
          <DealerOnboarding />
        </ProtectedRoute>
        <DealerRoute path="/dealer/dashboard">
          <DealerDashboard />
        </DealerRoute>
        <DealerRoute path="/dealer/car/new">
          <AddCar />
        </DealerRoute>
        <DealerRoute path="/dealer/car/edit/:id">
          <EditCar />
        </DealerRoute>
        <DealerRoute path="/dealer/profile">
          <DealerProfile />
        </DealerRoute>
        <Route path="/forgot-password">
          <ForgotPasswordPage />
        </Route>
        <Route path="/privacy">
          <PrivacyPage />
        </Route>
        <Redirect exact from="/login" to="/dealer/login" />
        <Route
          path="/ad/:id"
          render={({ match }) => <Redirect to={`/car/${match.params.id}`} />}
        />
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default MainRoutes;
