import AdminLayout from "./admin/AdminLayout";

<Route
  path="/admin/*"
  element={
    <AdminLayout>
      <AdminRoutes />
    </AdminLayout>
  }
/>
