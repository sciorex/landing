import React, { createContext, useContext, useState } from 'react';
import GitHubMigrationModal from '../components/GitHubMigrationModal';

interface GitHubMigrationContextType {
    openModal: (url: string) => void;
    isGitHubSciorexUrl: (url: string) => boolean;
}

const GitHubMigrationContext = createContext<GitHubMigrationContextType | undefined>(undefined);

export function GitHubMigrationProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState('');

    const openModal = (githubUrl: string) => {
        setUrl(githubUrl);
        setIsOpen(true);
    };

    const isGitHubSciorexUrl = (testUrl: string) => {
        return testUrl?.includes('github.com/sciorex') ?? false;
    };

    return (
        <GitHubMigrationContext.Provider value={{ openModal, isGitHubSciorexUrl }}>
            {children}
            <GitHubMigrationModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                originalUrl={url}
            />
        </GitHubMigrationContext.Provider>
    );
}

export function useGitHubMigration() {
    const context = useContext(GitHubMigrationContext);
    if (context === undefined) {
        throw new Error('useGitHubMigration must be used within a GitHubMigrationProvider');
    }
    return context;
}
