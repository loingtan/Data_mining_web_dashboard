import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic-home'),
  },
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-dashboard'),
  },
  {
    title: 'Teacher',
    path: '/teacher',
    icon: icon('ic-teacher'),
  },
  {
    title: 'Student',
    path: '/student',
    icon: icon('ic-student'),
  },
  {
    title: 'Predict',
    path: '/predict',
    icon: icon('ic-predict'),
  },
];
