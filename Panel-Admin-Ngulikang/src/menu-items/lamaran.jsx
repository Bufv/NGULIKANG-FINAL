
// assets
import { FileTextOutlined } from '@ant-design/icons';

// icons
const icons = {
    FileTextOutlined
};

// ==============================|| MENU ITEMS - LAMARAN ||============================== //

const lamaran = {
    id: 'lamaran',
    title: 'Lamaran',
    type: 'group',
    children: [
        {
            id: 'lamaran-masuk',
            title: 'Lamaran Masuk',
            type: 'item',
            url: '/lamaran/masuk',
            icon: icons.FileTextOutlined
        }
    ]
};

export default lamaran;
