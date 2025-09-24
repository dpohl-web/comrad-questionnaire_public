import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import './index.css';
import Layout from './components/Atoms/Layout/Layout';
import store from './store/store';
import { createRoot } from 'react-dom/client';
const Learningstyle = () => (
    <HashRouter>
        <Layout />
    </HashRouter>
);

const mount = document.getElementById('learningstyle');
const root = createRoot(mount);
const provider = (
    <Provider store={store}>
        <Learningstyle />
    </Provider>
);

root.render(provider);
