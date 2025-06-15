import {useState} from 'react';
import {useStore} from '../store/useStore.js';

function HomePage() {
    const saveToken = useStore((state) => state.setToken);
    const saveRepoUrl = useStore((state) => state.setRepoUrl);
    const [token, setToken] = useState('');
    const [repoUrl, setRepoUrl] = useState('');
    const [errors, setErrors] = useState({});
    const isDisabled = !token.trim() || !repoUrl.trim();

    const handleTokenChange = (e) => {
        setToken(e.target.value);

        if (errors.token) {
            setErrors((prev) => ({...prev, token: undefined}));
        }
    };

    const handleRepoChange = (e) => {
        setRepoUrl(e.target.value);

        if (errors.repo) {
            setErrors((prev) => ({...prev, repo: undefined}));
        }
    };

    const checkGithubToken = async () => {
        try {
            const res = await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                },
            });

            return res.ok;
        } catch (error) {
            return false;
        }
    };

    const validGithubRepo = () => {
        const newErrors = {};
        const repoRegex = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;

        if (!repoRegex.test(repoUrl.trim())) {
            newErrors.repo = 'Invalid URL format (expected: https://github.com/user/repo)';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validGithubRepo()) {
            return;
        }

        const isTokenValid = await checkGithubToken();

        if (!isTokenValid) {
            setErrors((prev) => ({...prev, token: 'Invalid or unauthorized token'}));

            return;
        }
        
        saveToken(token);
        saveRepoUrl(repoUrl);
    };

    return (
        <div className={"min-h-screen bg-white py-20"}>
            <div className="flex flex-col mx-auto p-4">
                <div className={" flex flex-col items-center mb-8 gap-2"}>
                    <h1 className={"text-3xl font-semibold text-blue-600"}>Welcome to GHAminer Dashboard</h1>
                    <p className={"max-w-md text-center text-black leading-6"}>To get started, enter your GitHub token
                        and the repository URL for which you want to view the dashboard.</p>
                </div>
                <form onSubmit={handleSubmit} className="w-1/3 mx-auto px-20 py-10 border border-blue-200 rounded-2xl">

                    <label className="block mb-4 mt-4">
                        GitHub Repository :
                        <input
                            type="text"
                            placeholder="https://github.com/user/repo"
                            value={repoUrl}
                            onChange={handleRepoChange}
                            className="w-full border rounded p-2 mt-1"
                        />
                        {errors.repo && <p className="text-red-500">{errors.repo}</p>}
                    </label>
                    <label className="block mb-2">
                        GitHub Token :
                        <input
                            type="password"
                            placeholder="github_pat_…"
                            value={token}
                            onChange={handleTokenChange}
                            className="w-full border rounded p-2 mt-1"
                        />
                        {errors.token && <p className="text-red-500">{errors.token}</p>}
                    </label>

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded w-full mt-5 ${
                            isDisabled ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'
                        }`}
                    >
                        Generate Dashboard
                    </button>
                </form>
            </div>
        </div>

    );
}

export default HomePage;
