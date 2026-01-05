// assets
import { LoginOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserOutlined
};

// ==============================|| MENU ITEMS - ACCOUNT ||============================== //

const pages = {
  id: 'account',
  title: 'Account',
  type: 'group',
  children: [
    {
      id: 'account-user',
      title: 'Akun User',
      type: 'item',
      url: '/account/user',
      icon: icons.UserOutlined
    },
    {
      id: 'account-tukang',
      title: 'Akun Tukang',
      type: 'item',
      url: '/account/tukang',
      icon: icons.UserOutlined
    }
  ]
};

export default pages;
