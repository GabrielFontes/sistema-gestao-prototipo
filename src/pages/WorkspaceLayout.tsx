import { Outlet } from 'react-router-dom';
import { Layout } from '@/components/Layout';

export default function WorkspaceLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
