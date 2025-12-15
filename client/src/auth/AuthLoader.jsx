useEffect(() => {
  const restoreUser = async () => {
    try {
      const res = await userApi.get("/me", {
        withCredentials: true,
      });
      dispatch(loginSuccess(res.data.user));
    } catch {
      dispatch(logout());
    }
  };

  restoreUser();
}, []);
