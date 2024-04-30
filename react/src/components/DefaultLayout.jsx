import Sidebar from './SideBar';
import Footer from './Footer';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function DefaultLayout() {

  return (
    <div className="min-h-full">
      <Sidebar />
      <Footer />
    </div>
  );
}
