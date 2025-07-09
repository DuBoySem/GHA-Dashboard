import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import {useStore} from "./store/useStore.js";

const App = () => {
    const token = useStore((state) => state.token);
    const repoUrl = useStore((state) => state.repoUrl);

    return token  ? <DashboardPage />: <HomePage/>
}

export default App;
