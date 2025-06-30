import {useState, useEffect} from 'react';
import {useStore} from '../store/useStore.js';

function HomePage() {
    const saveToken = useStore((state) => state.setToken);
    const saveRepoUrl = useStore((state) => state.setRepoUrl);
    const [token, setToken] = useState('');
    const [repoUrl, setRepoUrl] = useState('');
    const [errors, setErrors] = useState({});
    const isDisabled = !token.trim() || !repoUrl.trim();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const repoFromUrl = urlParams.get('repo');

        if (repoFromUrl) {
            localStorage.setItem('gha_repo_url', repoFromUrl);
            setRepoUrl(`https://github.com/${repoFromUrl}`);
        } else {
            const storedRepoUrl = localStorage.getItem('gha_repo_url');
            if (storedRepoUrl) {
                setRepoUrl(`https://github.com/${storedRepoUrl}`);
            }
        }
    }, []);

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
        <div className="min-h-screen bg-white py-20 min-w-[320px]">
            <div className="container mx-auto px-4 flex flex-col">
                <div className={" flex flex-col items-center mb-8 gap-2"}>
                    <h1 className={"text-3xl text-center font-semibold text-blue-600"}>Welcome to GHAminer Dashboard</h1>
                    <p className={"max-w-md text-center text-black leading-6"}>To get started, enter your GitHub token
                        and the repository URL for which you want to generate a dashboard.</p>
                </div>
                <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto px-6 md:px-20 py-10 border border-blue-200 rounded-2xl">


                    <label className="block mb-4 mt-4">
                        GitHub repository :
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
                        GitHub token :
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
                        Generate dashboard
                    </button>
                </form>
            </div>
        </div>

    );
}

export default HomePage;
