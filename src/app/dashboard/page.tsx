import requireUser from '@/data/user/require-user';

const Dashboard = async () => {
  await requireUser();
  return <div>Dashboard</div>;
};
export default Dashboard;
