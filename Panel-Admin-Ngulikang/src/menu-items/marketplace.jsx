
// assets
import { ShopOutlined } from '@ant-design/icons';

// icons
const icons = {
    ShopOutlined
};

// ==============================|| MENU ITEMS - MARKETPLACE ||============================== //

const marketplace = {
    id: 'marketplace',
    title: 'Marketplace',
    type: 'group',
    children: [
        {
            id: 'produk',
            title: 'Daftar Produk',
            type: 'item',
            url: '/marketplace/products',
            icon: icons.ShopOutlined
        }
    ]
};

export default marketplace;
