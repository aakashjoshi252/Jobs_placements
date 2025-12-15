const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useSelector(state => state.auth);

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};
export default ProtectedRoute;