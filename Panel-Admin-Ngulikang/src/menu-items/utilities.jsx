// assets
import {
  MessageOutlined
} from '@ant-design/icons';

// icons
const icons = {
  MessageOutlined
};

// ==============================|| MENU ITEMS - CHAT ||============================== //

const utilities = {
  id: 'chat',
  title: 'Chat',
  type: 'group',
  children: [
    {
      id: 'live-chat',
      title: 'Live Chat',
      type: 'item',
      url: '/chat/live',
      icon: icons.MessageOutlined
    }
  ]
};

export default utilities;

