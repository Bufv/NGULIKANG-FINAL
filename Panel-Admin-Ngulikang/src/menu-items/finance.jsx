
// assets
import { DollarCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
    DollarCircleOutlined
};

// ==============================|| MENU ITEMS - FINANCE ||============================== //

const finance = {
    id: 'finance',
    title: 'Keuangan',
    type: 'group',
    children: [
        {
            id: 'gaji',
            title: 'Gaji & Pemasukan',
            type: 'item',
            url: '/finance/gaji',
            icon: icons.DollarCircleOutlined
        }
    ]
};

export default finance;
