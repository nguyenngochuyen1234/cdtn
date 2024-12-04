import { HeaderComponent } from '@/components/Header';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
        <div>
            <HeaderComponent />
            <Outlet />

        </div>

    )
}

export default Main