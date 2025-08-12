import {useState, useEffect} from 'react';
import {useStore} from '../store/useStore.js';
import React from "react";

function HomePage() {
    const saveToken = useStore((state) => state.setToken);
    const saveRepoUrl = useStore((state) => state.setRepoUrl);
    const [token, setToken] = useState('');
    const [repoUrl, setRepoUrl] = useState('');
    const [errors, setErrors] = useState({});
    const isDisabled = !token.trim() || !repoUrl.trim();

    //fill repoUrl input field with URL of cuurent repo
    useEffect(() => {
        const currentUrl = window.location.href;
        const match = currentUrl.match(/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/);
        if (match) {
            setRepoUrl(match[0]);
        }
    }, []);

    const handleTokenChange = (e) => {
        setToken(e.target.value);

        if (errors.token) {
            setErrors((prev) => ({...prev, token: undefined}));
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
        <div className={"min-h-screen mx-auto max-w-1/2 bg-gray-50 py-20"}>
            <div className="flex flex-col mx-auto p-4">
                <div className={" flex flex-col items-center mb-5 gap-2"}>
                    <h1 className={"text-3xl font-semibold text-black"}>Welcome to GHAminer Dashboard</h1>
                    <p className={"max-w-md text-sm text-center text-black leading-6"}>To get started, enter your GitHub token to generate a dashboard for this GitHub repository.</p>
                </div>
                <form onSubmit={handleSubmit} className="w-1/2 mx-auto px-10 py-6 border border-black rounded-2xl bg-white">

                    <label className="block mb-2 text-black">
                        GitHub token :
                        <input
                            type="password"
                            placeholder="github_pat_…"
                            value={token}
                            onChange={handleTokenChange}
                            className="w-full border rounded p-2 mt-1 text-black bg-white"
                        />
                        {errors.token && <p className="text-red-500">{errors.token}</p>}
                    </label>

                    <button
                        type="submit"
                        disabled={isDisabled}
                        className={`px-4 py-2 rounded w-full mt-5 ${
                            isDisabled ? 'bg-gray-200 cursor-not-allowed text-gray-500' : 'bg-gray-800 text-white cursor-pointer hover:bg-gray-700'
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
